# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- ui: implement weekday active/inactive color pickers in AppTimeSettingsModal
- ui: implement uppercase toggle in DisplayCard
- ui: implement "start week on Monday" toggle in AppTimeSettingsModal
### Fixed
- ui: bugfix label visibility on edit in EditableInput

## [0.1.3] - 2023-10-27
### Added
- ui: implement calendar header/body/text color pickers in AppTimeSettingsModal
- ui: implement reset settings
- ui: implement weekday toggle in AppTimeSettingsModal
### Fixed
- ui: bugfix default colors, sometimes 0 means black, sometimes it means global text color
### Changed
- ui: v-align label in EditableInput
- ui: refactor EditableSelect into DropdownMenu in AppTimeSettingsModal
- ui: wrap ColorPicker into HexColorPicker to avoid code repetitions

## [0.1.2] - 2023-10-16
### Added
- ui: implement mode control in AppTimeSettingsModal
### Changed
- ui: refactor form into inline controls in AppTimeSettingsModal
- ui: refactor form into inline controls in AppDateSettingsModal

## [0.1.1] - 2023-10-16
### Added
- ui: refactor BaseModal to allow more configuration props
- ui: implement AppTimeSettingsModal, to set time app format
- ui: implement AppDateSettingsModal, to set date app format
### Fixed
- ui: bugfix http post method recursion in api module
### Changed
- ui: make cards' body font smaller

## [0.1.0] - 2023-10-15
### Added
- Initial release

[Unreleased]: https://github.com/awtrix-light/hub/compare/v0.1.3...HEAD
[0.1.3]: https://github.com/awtrix-light/hub/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/awtrix-light/hub/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/awtrix-light/hub/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/awtrix-light/hub/releases/tag/v0.1.0
