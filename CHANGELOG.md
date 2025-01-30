# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.3.1] - 2024-01-30

### Changed

* Restrict permissions to only the necessary hosts.

## [3.3.0] - 2024-01-29

### Fixed

* Remove background workers.
* Fully utilize `popup.js` for all functionality.
* Fallback to default harvest configuration if no configuration is found.
* Fix `harvestPlatform.js` to work with the latest Harvest platform.

## [3.2.1] - 2024-01-28

### Fixed

* Fixed `manifest.json` for Firefox specific requirements

## [3.2.0] - 2024-01-27

### Fixed
 * Fix parsing of ID and title on GitHub issues and pull requests.

## [3.1.0] - 2022-06-03
### Added
 * Support time tracking on GitHub issues
 * Update extension icon
 * Change time log to include issue ID and title
 * Add a loading indicator

 ### Changed
 * Code forked to new repo and maintainer

## [3.0.0] - 2020-07-17
### Added
 * Support time tracking on GitLab issues
 * Support time tracking on Zammad issues

### Changed
 * No more tracking button on the page itself, see [here for details](./docs/on-page-tracker.md).


## [2.3.0] - 2019-08-01
