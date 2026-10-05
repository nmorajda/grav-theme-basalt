# Basalt parent theme

## Scope

Basalt is an independent, reusable Grav 2 base theme and a separate Git
repository. Keep it generic. Site-specific branding, content and behavior belong
in a child theme or site configuration.

## Project structure

- `templates/partials/base.html.twig` defines the public document-shell blocks.
- `templates/collection.html.twig` is the generic collection page template.
- `templates/partials/collection/` contains collection item variants and cover
  handling.
- `templates/partials/elements/` contains generic UI and media renderers.
- `templates/partials/components/` contains public Bootstrap component and
  navbar partials.
- `templates/partials/components/section/` contains the public layout component
  for independently contained page sections.
- `templates/partials/components/navbar/mega/` contains public mega-menu
  layouts that child themes can override or extend.
- `templates/modular/` contains reusable content-source templates for widgets
  and mega menus.
- `templates/shortcodes/` contains shortcode presentation templates.
- `shortcodes/` contains the matching Shortcode Core PHP handlers.
- `src/scss/` and `src/js/` are the editable asset sources.
- `src/vendor/css/` and `src/vendor/js/` are optional third-party extension
  points.
- `dist/` contains generated, Git-tracked production assets.

## Twig and components

- Treat the `@basalt` namespace, documented blocks, public templates, partial
  paths, component variables, block names and public macros as
  child-theme APIs.
- Prefer small `include` and `embed` compositions over copying complete parent
  templates.
- Keep generic components independent from page-specific logic. Collection and
  plugin adapters should compose generic components.
- Escape text and attributes according to context. Use `raw` only for trusted
  Grav-rendered content, shortcode output or Media HTML.
- Reuse `templates/macros/attributes.html.twig` for component attribute maps
  and exclude every attribute owned by the component.
- Do not assume that the base `content` block has a Bootstrap container. Page
  templates and components own their container and full-width behavior.
- Preserve accessible names, relationships, focus behavior and Bootstrap state
  attributes.
- Do not require Twig in Content in public examples.

## Shortcodes

- Basalt shortcode handlers depend on the optional Shortcode Core plugin.
- Keep every registered handler paired with its template under
  `templates/shortcodes/`.
- Preserve nested parent-child contracts for `accordion`/`accordion-item`,
  `carousel`/`carousel-item` and `tabs`/`tab`.
- Validate or constrain values used for HTML tags, IDs, variants and Bootstrap
  classes.
- Keep shortcode examples usable without Twig in Content.

## Configuration and integrations

- Keep defaults in `basalt.yaml`, Admin fields in `blueprints.yaml`, README
  parameter names and Twig lookups aligned.
- Optional Grav plugins must remain optional and be guarded by both theme and
  plugin configuration where applicable.
- Add every theme translation key used in Twig to both English and Polish.
- Do not modify installed plugin code to implement a theme integration.

## Assets and build

- Edit CSS, JavaScript and fonts only in `src/`; never edit generated `dist/`
  files directly.
- Keep required Bootstrap SCSS and JavaScript imports aligned.
- Run `npm ci` with the Node.js version from `.nvmrc`.
- Run `npm run build` after source or release-version changes and include the
  updated tracked outputs.
- Preserve deterministic vendor filename ordering, per-file BOM removal and
  manifest-controlled loading.
- Empty vendor directories must remove stale optional bundles and produce
  `{"css":false,"js":false}` in `dist/basalt-vendor.json`.
- Do not commit `node_modules/` or development source maps.

## Verification

Before a feature commit, run the narrowest relevant checks plus:

- `git diff --check`;
- Twig syntax validation for changed templates;
- `php -l` for changed PHP;
- YAML parsing for changed YAML;
- `node --check gulpfile.js` when build logic is involved;
- `npm run build` when sources or generated assets are affected.

Before a release, additionally run:

- `npm ci`;
- a production build twice and confirm deterministic tracked output;
- checks for empty vendor bundles, the vendor manifest and leading BOM;
- validation that documented partials exist, shortcode handlers are registered,
  translation keys exist in English and Polish, and Bootstrap SCSS/JS imports
  match documented components;
- verification that CI still installs dependencies, builds and rejects
  generated-file drift.

Update release versions in `blueprints.yaml`, `package.json`, the root package
entries in `package-lock.json`, `src/scss/style.scss` and generated CSS. Update
`CHANGELOG.md` comparison links without rewriting historical releases.

## Compatibility and Git

Assess template, configuration, public CSS variable and asset-path changes for
child-theme compatibility. Prefer additive changes and document breaking
changes.

Run Git commands from this repository. Check `git status --short` before and
after work. Do not assume the surrounding Grav installation or sibling themes
belong to this repository. Do not commit, tag, merge or push unless explicitly
requested.
