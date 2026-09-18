# Basalt

![Basalt theme preview](screenshot.jpg)

Basalt is a modular Bootstrap 5 parent theme for Grav 2. It provides a minimal
foundation for building project-specific child themes without including the
complete Bootstrap CSS and JavaScript bundles.

> Basalt is currently in early development. Its structure and public API may
> change before version `1.0.0`.

## Features

- Grav 2 and PHP 8.3+ support
- Bootstrap 5 installed from npm
- selectable Bootstrap SCSS components
- selectable Bootstrap JavaScript components
- custom SCSS architecture
- JavaScript bundling with esbuild
- Gulp development and production tasks
- development source maps
- minified production assets
- Node.js version pinned with `.nvmrc`
- compiled assets included in `dist`
- explicit support for Grav child themes
- stable `@basalt` Twig namespace

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

Activate the theme in the Grav Admin panel or set it in the Grav configuration:

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

Only the required imports should remain enabled.

The default configuration includes Bootstrap base styles, containers, grid,
visually hidden helpers and dismissible alert styles without compiling every
Bootstrap component.

Bootstrap variables can be overridden before Bootstrap components are loaded.
Place Basalt and Bootstrap overrides in:

```text
src/scss/settings/_variables.scss
```

Variables intended as extension points should use `!default`.

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

The main JavaScript entry file is:

```text
src/js/script.js
```

Bootstrap JavaScript components are selected in:

```text
src/js/modules/bootstrap.js
```

Only the required component imports should remain enabled:

```js
import "bootstrap/js/dist/alert";

// import "bootstrap/js/dist/collapse";
// import "bootstrap/js/dist/dropdown";
// import "bootstrap/js/dist/modal";
```

When enabling a JavaScript component, make sure its corresponding SCSS imports
are also enabled in `src/scss/_bootstrap-components.scss`.

For example, dismissible alerts require:

```scss
@import "bootstrap/scss/transitions";
@import "bootstrap/scss/alert";
@import "bootstrap/scss/close";
```

and:

```js
import "bootstrap/js/dist/alert";
```

Dropdowns, popovers and tooltips additionally require Popper.

The selected Bootstrap modules and custom JavaScript are bundled by esbuild
into a single `dist/js/script.js` file.

See the [Bootstrap optimization guide](https://getbootstrap.com/docs/5.3/customize/optimize/)
for more information about selective JavaScript imports.

## Theme inheritance

Basalt is intended to be used as a reusable parent theme. Each website can use
a project-specific child theme for its branding, templates and custom assets.

A child theme stream should search the child first and Basalt second:

```yaml
streams:
  schemes:
    theme:
      type: ReadOnlyStream
      prefixes:
        '':
          - user://themes/basalt-child
          - user://themes/basalt

enabled: true
```

The child theme class extends Basalt:

```php
<?php

declare(strict_types=1);

namespace Grav\Theme;

class BasaltChild extends Basalt
{
}
```

The child theme blueprint should declare Basalt as a dependency:

```yaml
dependencies:
  - name: grav
    version: '>=2.0.0'
  - name: basalt
    version: '>=0.3.0'
```

### Extending parent templates

Basalt registers its templates under the `@basalt` Twig namespace. A child base
template can therefore explicitly extend the parent:

```twig
{% extends '@basalt/partials/base.html.twig' %}
```

Use `parent()` when extending asset blocks:

```twig
{% extends '@basalt/partials/base.html.twig' %}

{% block stylesheets %}
    {{ parent() }}

    {% do assets.addCss('theme://dist/css/child.css', 90) %}
{% endblock %}

{% block javascripts %}
    {{ parent() }}

    {% do assets.addJs('theme://dist/js/child.js', {
        group: 'bottom',
        priority: 90
    }) %}
{% endblock %}
```

A template with the same path in the child theme overrides the corresponding
parent template. Templates that are fully overridden do not automatically
receive later changes made to the parent version.

### Child theme assets

The recommended additive asset names are:

```text
dist/css/child.css
dist/js/child.js
```

Basalt registers its assets with priority `100`. Child assets use priority `90`,
so they are rendered afterwards and can override parent styles.

Creating a file in the child theme with the same path as a Basalt asset replaces
the parent asset completely:

```text
dist/css/style.css
dist/js/script.js
```

Use identical paths only when complete replacement is intentional. In normal
child themes, use `child.css` and `child.js`.

The Grav Asset Pipeline can combine the final parent, child and plugin assets.
It does not compile SCSS or bundle JavaScript modules, so it does not replace
the Gulp and esbuild workflow.

For development, keeping the Grav pipelines disabled makes individual assets
and source maps easier to inspect. They can be enabled in production to reduce
the number of requests.

### Bootstrap components in child themes

Basalt owns the Bootstrap installation, Sass configuration and component
selection. Child themes should not compile a second copy of Bootstrap by
default.

CSS custom properties exposed by Bootstrap or Basalt can be overridden in
`child.css`. Sass variables cannot change Bootstrap code that has already been
compiled into the parent `style.css`.

When another generally useful Bootstrap component is required, add its SCSS and
JavaScript imports to Basalt and release a new Basalt version. Project-specific
styles and scripts remain in the child theme.

## Updating Basalt

Updating the parent theme does not overwrite files stored in the child theme.

Changes to parent templates are inherited unless the child theme completely
overrides the same template. After updating Basalt, review overridden templates
for upstream changes and test the child theme against the required Basalt
version declared in its blueprint.

## Project structure

```text
basalt/
├── dist/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── images/
│   └── logo.png
├── src/
│   ├── js/
│   │   ├── modules/
│   │   │   └── bootstrap.js
│   │   └── script.js
│   └── scss/
│       ├── base/
│       ├── components/
│       ├── layout/
│       ├── settings/
│       ├── tools/
│       ├── utilities/
│       ├── _basalt.scss
│       ├── _bootstrap-components.scss
│       └── style.scss
├── templates/
│   ├── partials/
│   │   └── base.html.twig
│   ├── default.html.twig
│   └── error.html.twig
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