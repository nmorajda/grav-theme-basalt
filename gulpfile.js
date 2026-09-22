const path = require("node:path");
const { mkdir, readFile, readdir, rm, writeFile } = require("node:fs/promises");
const { src, dest, watch, series, parallel } = require("gulp");
const gulpSass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const gulpIf = require("gulp-if");
const plumber = require("gulp-plumber");
const esbuild = require("esbuild");

let isProduction = false;

const paths = {
    output: path.join(__dirname, "dist"),
    styles: {
        entries: [
            "src/scss/style.scss",
            "src/scss/icons.scss"
        ],
        watch: "src/scss/**/*.scss",
        destination: "dist/css"
    },
    fonts: {
        source: [
            "node_modules/bootstrap-icons/font/fonts/*.{woff,woff2}",
            "src/fonts/**/*.{woff,woff2}"
        ],
        watch: "src/fonts/**/*.{woff,woff2}",
        destination: "dist/fonts"
    },
    scripts: {
        entry: "src/js/script.js",
        watch: "src/js/**/*.js",
        destination: path.join(__dirname, "dist/js/script.js")
    }
};

function setProduction(done) {
    isProduction = true;
    done();
}

function cleanTask() {
    return rm(paths.output, {
        recursive: true,
        force: true
    });
}

function stylesTask() {
    const destinationOptions = isProduction
        ? {}
        : { sourcemaps: "." };

    return src(paths.styles.entries, {
        sourcemaps: !isProduction
    })
        .pipe(gulpIf(!isProduction, plumber()))
        .pipe(
            gulpSass({
                loadPaths: ["node_modules"],
                quietDeps: true,
                silenceDeprecations: ["import"]
            })
        )
        .pipe(postcss([autoprefixer()]))
        .pipe(gulpIf(isProduction, cleanCSS()))
        .pipe(dest(paths.styles.destination, destinationOptions));
}

function fontsTask() {
    return src(paths.fonts.source, {
        encoding: false
    })
        .pipe(dest(paths.fonts.destination));
}

async function scriptsTask() {
    await esbuild.build({
        entryPoints: [paths.scripts.entry],
        bundle: true,
        outfile: paths.scripts.destination,
        format: "iife",
        target: ["es2020"],
        sourcemap: !isProduction,
        minify: isProduction
    });
}

async function vendorTask() {
    async function bundle(kind, extension, separator) {
        const directory = path.join(__dirname, "src/vendor", kind);
        const output = path.join(
            __dirname,
            `dist/${kind}/basalt-plugins.${extension}`
        );

        const entries = await readdir(directory, { withFileTypes: true });
        const files = entries
            .filter((entry) =>
                entry.isFile() && entry.name.endsWith(`.${extension}`)
            )
            .map((entry) => entry.name)
            .sort();

        const contents = [];

        for (const file of files) {
            const content = (
                await readFile(path.join(directory, file), "utf8")
            ).replace(/^\uFEFF/, "");
            if (content.trim()) contents.push(content);
        }

        if (!contents.length) {
            await rm(output, { force: true });
            return false;
        }

        await mkdir(path.dirname(output), { recursive: true });
        await writeFile(output, `${contents.join(separator)}\n`);
        return true;
    }

    const css = await bundle("css", "css", "\n");
    const js = await bundle("js", "js", "\n;\n");

    await mkdir(paths.output, { recursive: true });
    await writeFile(
        path.join(paths.output, "basalt-vendor.json"),
        JSON.stringify({ css, js }) + "\n"
    );
}

function watchTask() {
    watch(paths.styles.watch, stylesTask);
    watch(paths.fonts.watch, fontsTask);
    watch(paths.scripts.watch, scriptsTask);
    watch("src/vendor/**/*.{css,js}", vendorTask);
}

const compileTask = parallel(
    stylesTask,
    fontsTask,
    scriptsTask,
    vendorTask
);

exports.clean = cleanTask;
exports.styles = stylesTask;
exports.fonts = fontsTask;
exports.scripts = scriptsTask;
exports.vendor = vendorTask;
exports.watch = watchTask;
exports.build = series(setProduction, cleanTask, compileTask);
exports.default = series(cleanTask, compileTask, watchTask);
