const path = require("node:path");
const { rm } = require("node:fs/promises");
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
        entry: "src/scss/style.scss",
        watch: "src/scss/**/*.scss",
        destination: "dist/css"
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

    return src(paths.styles.entry, {
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

function watchTask() {
    watch(paths.styles.watch, stylesTask);
    watch(paths.scripts.watch, scriptsTask);
}

const compileTask = parallel(stylesTask, scriptsTask);

exports.clean = cleanTask;
exports.styles = stylesTask;
exports.scripts = scriptsTask;
exports.watch = watchTask;
exports.build = series(setProduction, cleanTask, compileTask);
exports.default = series(cleanTask, compileTask, watchTask);
