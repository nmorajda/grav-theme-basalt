# Basalt

![Basalt theme preview](screenshot.jpg)

Basalt is a modular Bootstrap 5 base theme for Grav 2. It provides a minimal
foundation for building custom Grav themes without requiring the complete
Bootstrap CSS and JavaScript bundle.

> Basalt is currently in early development. Version `0.1.0` provides the
> development environment, modular Bootstrap imports, asset compilation and
> minimal Twig templates.

## Features

- Grav 2 and PHP 8.3+ support
- Bootstrap 5 installed from npm
- selectable Bootstrap SCSS components
- custom SCSS architecture
- JavaScript bundling with esbuild
- Gulp development and production tasks
- development source maps
- minified production assets
- Node.js version pinned with `.nvmrc`
- compiled assets included in `dist`
- foundation for inherited Grav themes

## Requirements

Development requires:

- Grav 2.0+
- PHP 8.3+
- Node.js 22
- npm 10+

Node.js `22.23.2` is defined in `.nvmrc`.

The compiled theme can be used without Node.js or npm.

## Installation

Clone the repository into the Grav themes directory:

```bash
cd user/themes
git clone git@github.com:nmorajda/grav-theme-basalt.git basalt
```

Activate the theme in the Grav Admin panel or set it in your Grav configuration:

```yaml
pages:
  theme: basalt
```

## Development

Enter the theme directory and activate the required Node.js version:

```bash
cd user/themes/basalt
nvm install
nvm use
npm ci
```

Start the development watcher:

```bash
npm start
```

Create production assets:

```bash
npm run build
```

Development builds include source maps. Production builds are minified and
written to:

```text
dist/css/style.css
dist/js/script.js
```

## Modular Bootstrap SCSS

Bootstrap components are selected in:

```text
src/scss/_bootstrap-components.scss
```

Only the required imports need to remain enabled. For example, the initial
Basalt configuration includes Bootstrap containers and grid without compiling
every Bootstrap component.

Bootstrap variables can be overridden before Bootstrap components are loaded.
Place Basalt and Bootstrap overrides in:

```text
src/scss/settings/_variables.scss
```

Custom theme styles are organized under:

```text
src/scss/base/
src/scss/components/
src/scss/layout/
src/scss/settings/
src/scss/tools/
src/scss/utilities/
```

## Modular Bootstrap JavaScript

The JavaScript entry file is:

```text
src/js/script.js
```

Bootstrap JavaScript components can be imported individually when required:

```js
import Collapse from "bootstrap/js/dist/collapse";
```

The source is bundled by esbuild into `dist/js/script.js`.

## Theme inheritance

Basalt is intended to serve as a reusable parent theme. Project-specific Grav
themes can inherit its templates and assets while providing their own Twig
templates, SCSS variables, components and branding.

This keeps the Bootstrap foundation and build environment reusable across
multiple projects.

## Project structure

```text
basalt/
├── dist/
│   ├── css/
│   └── js/
├── images/
├── src/
│   ├── js/
│   └── scss/
├── templates/
│   └── partials/
├── basalt.php
├── basalt.yaml
├── blueprints.yaml
├── gulpfile.js
├── package.json
└── README.md
```

## Production assets

The `dist` directory is committed to the repository intentionally. This allows
the theme to be installed and used without running the Node.js build process.

Source maps are development-only and are excluded from Git.

## License

Basalt is released under the [MIT License](LICENSE).