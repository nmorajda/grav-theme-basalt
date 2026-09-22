# Basalt parent theme

## Scope

Basalt is an independent, reusable Grav 2 base theme and a separate Git repository. Keep it generic: site-specific branding, content, and behavior belong in a child theme.

## Assets and build

- Edit theme CSS, JavaScript, and font sources in `src/scss/`, `src/js/`, and `src/fonts/`. Put optional third-party browser assets in `src/vendor/css/` and `src/vendor/js/`.
- Do not edit generated files in `dist/` directly, including optional vendor bundles and `basalt-vendor.json`.
- Keep required Bootstrap SCSS and JavaScript component imports aligned.
- After source asset changes, run `npm run build` and include the updated, Git-tracked `dist/` files. Use the narrower `vendor` Gulp task only when rebuilding optional vendor assets intentionally.
- Preserve deterministic filename ordering, per-file BOM removal and manifest-controlled Twig loading for vendor assets.
- Empty vendor directories must remove stale optional bundles and produce `{"css":false,"js":false}` in `dist/basalt-vendor.json`.
- Use the Node.js version from `.nvmrc` and install dependencies with `npm ci` when setup is required.
- Do not edit or commit `node_modules/` or development source maps.

## Compatibility

- Treat Twig templates, the `@basalt` namespace, block structure, asset paths, configuration keys, and public CSS custom properties as interfaces used by child themes.
- Assess template and public CSS variable changes for backward compatibility with child themes.
- Prefer additive, backward-compatible changes; document unavoidable breaking changes.

## Git boundary

Run Git checks from this directory. Do not assume the surrounding Grav installation or sibling child themes belong to this repository.
