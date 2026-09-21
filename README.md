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
- system font stack with configurable typography hooks
- support for self-hosted and optional external fonts

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

## Typography and fonts

Basalt uses Bootstrap's system font stack by default. It does not download any
text fonts from external services, so the default configuration requires no
additional network requests.

The actual font depends on the visitor's operating system and may be Segoe UI,
the Apple system font, Roboto, Noto Sans, Liberation Sans or another locally
available sans-serif font.

Basalt exposes two CSS custom properties:

```css
--basalt-font-family-base
--basalt-font-family-headings
```

Their default values are defined in:

```text
src/scss/base/_fonts.scss
```

The base font is also connected to Bootstrap's body font property:

```scss
:root {
    --basalt-font-family-base: var(--bs-font-sans-serif);
    --basalt-font-family-headings: var(--basalt-font-family-base);
    --bs-body-font-family: var(--basalt-font-family-base);
}
```

This allows child themes to change body and heading typography without
recompiling the parent theme.

### Self-hosted fonts

Self-hosted fonts are recommended when consistent typography is required.
They avoid requests to third-party font services and provide greater control
over privacy, caching and availability.

Before including a font, make sure its license permits web embedding and
distribution.

Basalt provides the following source directory for locally hosted fonts:

```text
src/fonts/
```

During the build, Gulp copies `woff` and `woff2` files to:

```text
dist/fonts/
```

Subdirectories are preserved. For example:

```text
src/fonts/inter/InterVariable.woff2
src/fonts/inter/InterVariable-Italic.woff2
```

are copied to:

```text
dist/fonts/inter/InterVariable.woff2
dist/fonts/inter/InterVariable-Italic.woff2
```

A variable font can be registered in SCSS as follows:

```scss
@font-face {
    font-family: "Inter";
    src: url("../fonts/inter/InterVariable.woff2") format("woff2");
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
}

@font-face {
    font-family: "Inter";
    src: url("../fonts/inter/InterVariable-Italic.woff2") format("woff2");
    font-style: italic;
    font-weight: 100 900;
    font-display: swap;
}

:root {
    --basalt-font-family-base: "Inter", var(--bs-font-sans-serif);
    --basalt-font-family-headings: "Inter", var(--bs-font-sans-serif);
}
```

The font URLs are relative to the generated `dist/css/style.css` file.

For static fonts, create a separate `@font-face` declaration for every required
weight and style:

```scss
@font-face {
    font-family: "Example Sans";
    src: url("../fonts/example-sans/ExampleSans-Regular.woff2") format("woff2");
    font-style: normal;
    font-weight: 400;
    font-display: swap;
}

@font-face {
    font-family: "Example Sans";
    src: url("../fonts/example-sans/ExampleSans-Bold.woff2") format("woff2");
    font-style: normal;
    font-weight: 700;
    font-display: swap;
}
```

WOFF2 is the recommended format for modern browsers. WOFF remains supported by
the build process for projects that require additional legacy compatibility.
TTF, OTF and EOT files are not copied by default.

Only include the weights, styles and character subsets that are actually used.
This reduces the amount of data downloaded by visitors.

After adding or changing fonts, rebuild the production assets:

```bash
npm run build
```

Basalt does not include a text font in the repository. Bootstrap Icons are
handled separately and are copied to `dist/fonts` by the same build process.

### Fonts in child themes

A child theme can override the Basalt typography properties in its own CSS:

```css
:root {
    --basalt-font-family-base: "Example Sans", var(--bs-font-sans-serif);
    --basalt-font-family-headings: "Example Sans", var(--bs-font-sans-serif);
}
```

A child theme that self-hosts fonts should keep them in its own source directory
and copy them to its own `dist/fonts` directory. The Basalt build process only
processes files belonging to Basalt and does not build assets stored in sibling
child themes.

The child stylesheet can then reference its own generated font files:

```css
@font-face {
    font-family: "Example Sans";
    src: url("../fonts/example-sans/ExampleSans-Regular.woff2") format("woff2");
    font-style: normal;
    font-weight: 400;
    font-display: swap;
}
```

### External font services

The parent base template provides an empty `font_stylesheets` block. A child
theme can override it when an external font service is intentionally required:

```twig
{% extends '@basalt/partials/base.html.twig' %}

{% block font_stylesheets %}
    {% do assets.addCss(
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
        110
    ) %}
{% endblock %}
```

The selected family must also be assigned in the child stylesheet:

```css
:root {
    --basalt-font-family-base: "Inter", var(--bs-font-sans-serif);
    --basalt-font-family-headings: "Inter", var(--bs-font-sans-serif);
}
```

External font services create requests to third-party servers and may require
additional privacy, consent and Content Security Policy considerations.
Self-hosting is therefore the recommended approach for privacy-sensitive
projects.

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

## Navigation and Bootstrap Icons

Basalt provides a responsive Bootstrap navbar generated from visible Grav
pages. The navigation template is located in:

```text
templates/partials/navigation.html.twig
```

Menu items are rendered by:

```text
templates/macros/navigation.html.twig
```

The responsive navigation uses the Bootstrap Collapse component. Dropdown
menus additionally use the Bootstrap Dropdown component.

### Navigation configuration

Navigation options are configured in `basalt.yaml`:

```yaml
dropdown:
  enabled: true

icons:
  enabled: true
```

Both options can also be changed from the Grav Admin theme configuration.

### Navigation contract

- A regular navigation item is rendered as a link.
- When `dropdown.enabled` is enabled, an item with visible children is rendered
  only as a dropdown label and button, without an `href` attribute.
- The submenu contains only the item's children; no additional Overview item is
  generated.
- The default navigation supports one submenu level.
- When `dropdown.enabled` is disabled, the parent is rendered as a regular link
  and its children are not displayed.
- `icons.enabled` controls whether configured navigation icons are displayed.

More complex navigation structures can be implemented by overriding the
navigation macro in a child theme.

### Menu icons

Basalt includes [Bootstrap Icons](https://icons.getbootstrap.com/) as a local
npm dependency. The icon stylesheet and font files are generated into:

```text
dist/css/icons.css
dist/fonts/bootstrap-icons.woff
dist/fonts/bootstrap-icons.woff2
```

No external icon service or CDN request is required.

An icon can be assigned to a page in its Markdown front matter:

```yaml
---
title: Home
menu: Home
icon: house
---
```

Use the Bootstrap Icon name without the `bi-` prefix. For example:

```yaml
icon: house
icon: person
icon: envelope
icon: gear
```

The navigation macro converts `icon: house` into:

```html
<i class="navigation-icon bi bi-house" aria-hidden="true"></i>
```

Icons added to navigation labels are decorative. The visible page label
remains available to assistive technologies.

### Using icons in templates and content

Bootstrap Icons can also be used directly in Twig templates or HTML content:

```html
<i class="bi bi-check-lg" aria-hidden="true"></i>
```

When an icon is used next to visible text, it should normally be hidden from
assistive technologies with `aria-hidden="true"`.

An icon-only control must have an accessible name:

```html
<button type="button" class="btn btn-primary" aria-label="Save">
    <i class="bi bi-check-lg" aria-hidden="true"></i>
</button>
```

Alternatively, provide visually hidden text:

```html
<button type="button" class="btn btn-primary">
    <i class="bi bi-check-lg" aria-hidden="true"></i>
    <span class="visually-hidden">Save</span>
</button>
```

Do not rely on an icon alone to communicate important information.

### Disabling Bootstrap Icons

Bootstrap Icons can be disabled in `basalt.yaml`:

```yaml
icons:
  enabled: false
```

When disabled:

- `dist/css/icons.css` is not added to the page;
- navigation icon markup is not rendered;
- the local font files remain in the installed package but are not requested
  by the browser.

A child theme can provide a different icon system by disabling Bootstrap Icons
and overriding the relevant templates or macro.

## Optional breadcrumbs

Basalt can render breadcrumbs from the official Grav Breadcrumbs plugin without
requiring or installing it automatically. Install the plugin when the site
needs breadcrumb navigation:

```bash
bin/gpm install breadcrumbs
```

Set `built_in_css: false` in the plugin configuration so that the plugin does
not load its own stylesheet. Basalt uses the Bootstrap breadcrumb component
already included in the theme CSS. The plugin must remain enabled for the
component to render.

The integration uses the hierarchy returned by `breadcrumbs.get()` and respects
the plugin's hierarchy, visibility, trailing-link and home-icon settings.
Bootstrap supplies the breadcrumb divider. Breadcrumbs is intentionally not
listed as a Basalt dependency in `blueprints.yaml`, so the theme continues to
work when the plugin is absent.

The public breadcrumb partial keeps its accessible navigation markup separate
from its Schema.org data. It delegates JSON-LD generation to an internal partial
and emits the structured data only when the trail contains at least two items.

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
    version: '>=0.5.0'
```

### Extending parent templates

Basalt registers its templates under the `@basalt` Twig namespace. A child base
template can therefore explicitly extend the parent:

```twig
{% extends '@basalt/partials/base.html.twig' %}
```

### Public Twig API

The following blocks are the stable public Twig API for child themes in Basalt
0.6.0:

| Block | Defined in | Purpose | Call `parent()`? | Override model |
| --- | --- | --- | --- | --- |
| `title` | `templates/partials/base.html.twig` | Renders the complete document title element. | No when replacing the title. | Full replacement. |
| `head_extra` | `templates/partials/base.html.twig` | Provides an empty extension point at the end of the document head. | Not required; the parent block is empty. | Add child-specific head elements. |
| `font_stylesheets` | `templates/partials/base.html.twig` | Registers font stylesheets before the main theme stylesheet. | Not required; the parent block is empty. | Add font assets. |
| `theme_stylesheet` | `templates/partials/base.html.twig` | Selects and registers one main theme stylesheet. | No; the child selects the replacement stylesheet. | Full replacement of the main stylesheet selection. |
| `stylesheets` | `templates/partials/base.html.twig` | Registers font, main theme and optional icon stylesheets. | Yes, when preserving parent stylesheets. | Add stylesheet registrations around the parent output. |
| `javascripts` | `templates/partials/base.html.twig` | Registers the parent JavaScript bundle in the `bottom` group. | Yes, when preserving parent scripts. | Add script registrations around the parent output. |
| `skip_links` | `templates/partials/base.html.twig` | Renders the required main-content skip link and provides an extension point for additional skip links. | Yes, when adding links; not when providing an equivalent complete collection. | Extend the parent output or replace the collection while preserving a link to `#main-content`. |
| `header` | `templates/partials/base.html.twig` | Renders the document header through the public header partial. | Only when retaining the parent header. | Full replacement of the header region. |
| `main` | `templates/partials/base.html.twig` | Renders the main element, container and page content block. | Only when retaining the parent main region. | Full replacement of the main region. |
| `breadcrumbs` | `templates/partials/base.html.twig` | Conditionally renders the optional Breadcrumbs plugin integration before page content. | Only when retaining the parent breadcrumbs. | Add content around or replace the breadcrumb region. |
| `content` | `templates/partials/base.html.twig`, `templates/default.html.twig`, `templates/error.html.twig` | Renders content defined by the current page template. | Only when extending that page type's existing content. | Page-type-dependent full replacement. |
| `footer` | `templates/partials/base.html.twig` | Renders the document footer through the public footer partial. | Only when retaining the parent footer. | Full replacement of the footer region. |
| `bottom` | `templates/partials/base.html.twig` | Renders the final `bottom` JavaScript asset group before `</body>`. | Yes. | Add content while preserving final script output. |

The empty `head_extra` block can add child-specific elements such as favicons,
a web app manifest, verification tags or additional metadata. Basalt does not
automatically provide analytics, Google Tag Manager, Open Graph, Twitter Cards
or JSON-LD. Because `head_extra` is rendered at the end of the head, it should
not be treated as the preferred location for performance-critical preloads.

The narrow `theme_stylesheet` block registers `dist/css/style.css` by default.
A child can replace it without `parent()` to select an alternative compiled
stylesheet without duplicating the surrounding asset logic. The optional
`icons.css` remains outside this block and is handled by `stylesheets` in both
cases.

Other blocks, including `head`, `metadata`, `canonical`, `assets`, `body` and
`skip_link`, can technically be overridden. They are implementation details and
are not part of the stable public Twig API for Basalt 0.6.0.

A child can extend the public `skip_links` block and call `parent()` to retain
the default link to `#main-content` while adding links to other landmarks. A
full replacement must still provide an equivalent link to `#main-content`.

A child that replaces the public `main` block must preserve both
`id="main-content"` and `tabindex="-1"` on its main content target. The skip link
depends on this contract to move navigation past the site header.

Basalt sets the document `dir` attribute from Grav's active language metadata.
This improves document semantics for right-to-left languages but does not claim
complete visual RTL support for every component.

The following partials are public override points for child themes:

| Partial | Responsibility |
| --- | --- |
| `templates/partials/header.html.twig` | Renders the site header and includes the navigation partial. |
| `templates/partials/brand.html.twig` | Renders the home link with `site.title`; override it to provide a custom brand or logo. |
| `templates/partials/navigation.html.twig` | Renders the responsive navbar and delegates menu items to the navigation macro. |
| `templates/partials/breadcrumbs.html.twig` | Renders optional plugin data as an accessible Bootstrap breadcrumb and delegates JSON-LD generation to an internal partial. |
| `templates/partials/footer.html.twig` | Renders the site footer. |

The public navigation macro is defined in
`templates/macros/navigation.html.twig` with this signature:

```twig
navigation.render(items, dropdown_enabled, icons_enabled)
```

It renders the supplied items according to the documented navigation contract
and the dropdown and icon switches. The internal `navigation.icon()` helper is
not part of the public API.

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
│   │   ├── icons.css
│   │   └── style.css
│   ├── fonts/
│   │   ├── bootstrap-icons.woff
│   │   └── bootstrap-icons.woff2
│   └── js/
│       └── script.js
├── images/
│   └── logo.png
├── src/
│   ├── fonts/
│   ├── js/
│   │   ├── modules/
│   │   │   └── bootstrap.js
│   │   └── script.js
│   └── scss/
│       ├── base/
│       │   ├── _document.scss
│       │   └── _fonts.scss
│       ├── components/
│       ├── layout/
│       │   ├── _footer.scss
│       │   ├── _header.scss
│       │   ├── _main.scss
│       │   └── _navigation.scss
│       ├── settings/
│       │   └── _variables.scss
│       ├── tools/
│       ├── utilities/
│       ├── _basalt.scss
│       ├── _bootstrap-components.scss
│       ├── icons.scss
│       └── style.scss
├── templates/
│   ├── macros/
│   │   └── navigation.html.twig
│   ├── partials/
│   │   ├── base.html.twig
│   │   ├── brand.html.twig
│   │   ├── footer.html.twig
│   │   ├── header.html.twig
│   │   └── navigation.html.twig
│   ├── default.html.twig
│   └── error.html.twig
├── basalt.php
├── basalt.yaml
├── blueprints.yaml
├── CHANGELOG.md
├── gulpfile.js
├── languages.yaml
├── LICENSE
├── package.json
├── README.md
├── screenshot.jpg
└── thumbnail.png
```

## Production assets

The `dist` directory is committed to the repository intentionally. This allows
the theme to be installed and used without running the Node.js build process.

Source maps are development-only and are excluded from Git.

## License

Basalt is released under the [MIT License](LICENSE).
