## [0.6.0] - 2026-10-31

- Fixed the paint colour/tool coupling so changing black/white/transparent keeps the selected shape or fill tool active.
- Added one original canvas with up to three independently configurable generated interpretations.
- Added contextual canvas selection: settings are shown only after selecting the original or a generated interpretation.
- Added independent output resolutions using nearest-neighbour resampling without changing the original grid.
- Expanded the engine to seven techniques: local majority, edge-aware contrast, directional gradient and ordered dithering join the original three.
- Added a weighted-vote resolver alongside weighted average and highest confidence.
- Upgraded the project format to version 2 while retaining import compatibility with version 1.
- Added four importable example projects, each with three outputs: lighthouse, moonlit cat, mushroom grove and desert temple.
- Added unit, integration and Playwright coverage for the new editor model, calculations and example projects.

## [0.5.0] - 2026-10-31

- Added 16- and 32-colour palette sizes in setup and editor controls.
- Expanded the built-in palette catalog to 34 presets: 10×4, 8×8, 6×12, 6×16 and 4×32.
- Added new 4-, 8-, 12-, 16- and 32-colour palettes.
- Added palette-family, uniqueness, inversion and 16/32-colour conversion tests.
- Expanded Portuguese project documentation and added a dedicated palette catalog.
- Clarified current limitations: document tabs are session-memory only; import/export remains per project.

