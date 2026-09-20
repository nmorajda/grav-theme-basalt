# Changelog

All notable changes to Basalt will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.5.0] - 2026-09-20

### Added

- Narrow public `theme_stylesheet` block for replacing the main stylesheet in child themes.
- Public overridable `partials/brand.html.twig` component.
- Documentation for the stable public Twig blocks, partials and navigation macro.

### Changed

- Stabilized the documented navigation contract for child themes.
- Updated navigation ARIA labels to use the existing translation keys.
- Documented parent stylesheet replacement for child-compiled CSS.

## [0.4.0] - 2026-09-19

### Added

- Extensible header, navigation, main content and footer partials.
- Base layout SCSS modules with configurable spacing variables.
- Responsive Bootstrap navbar with accessible collapse controls.
- Navigation macro with configurable dropdown support.
- Active navigation states and `aria-current` attributes.
- Theme translations for navigation and accessibility labels.
- Optional Bootstrap Icons integration.
- Separate compiled Bootstrap Icons stylesheet and local font assets.
- Build task for copying WOFF and WOFF2 font files.
- Source directory for self-hosted fonts.
- Typography hooks for body and heading font families.
- Empty `font_stylesheets` Twig block for optional external font services.
- Documentation for system, self-hosted and externally hosted fonts.

### Changed

- Refactored the base template into extensible Twig blocks and partials.
- Expanded the default and error templates to use the shared layout.
- Enabled the Bootstrap SCSS and JavaScript components required by navigation.
- Updated the documented project structure.

## [0.3.0] - 2026-09-18

### Added

- Stable `@basalt` Twig namespace for explicit parent template inheritance.
- Support for extending Basalt templates from a Grav child theme.
- Documentation for additive and replacement child-theme assets.

## [0.2.0] - 2026-09-15

### Added

- Modular Bootstrap JavaScript component imports.
- Dismissible Bootstrap alert support.
- Documentation for matching Bootstrap SCSS and JavaScript components.
- Tracked placeholder files for the documented SCSS directory structure.

### Changed

- Enabled Bootstrap transitions, alerts and close button styles.

## [0.1.0] - 2026-09-15

### Added

- Initial Grav 2 theme structure.
- Minimal Twig templates.
- Modular Bootstrap 5 SCSS imports.
- Custom SCSS directory structure.
- Gulp development and production tasks.
- JavaScript bundling with esbuild.
- Node.js and npm version requirements.
- Initial Basalt branding and theme preview assets.

[Unreleased]: https://github.com/nmorajda/grav-theme-basalt/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/nmorajda/grav-theme-basalt/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/nmorajda/grav-theme-basalt/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/nmorajda/grav-theme-basalt/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/nmorajda/grav-theme-basalt/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/nmorajda/grav-theme-basalt/releases/tag/v0.1.0
