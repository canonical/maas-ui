## MAAS UI

[![CircleCI](https://circleci.com/gh/canonical-web-and-design/maas-ui/tree/master.svg?style=svg)](https://circleci.com/gh/canonical-web-and-design/maas-ui/tree/master) ![CI](https://github.com/canonical-web-and-design/maas-ui/workflows/CI/badge.svg)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

- [About](#about)
- [Contributing](#contributing)
- [Feedback](#feedback)
- [Related Projects](#related-projects)
- [Built With](#built-with)
- [Team Members](#team-members)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## About

MAAS is an open-source tool that lets you build a data centre from bare-metal servers. You can discover, commission, deploy, and dynamically reconfigure a large network of individual units.

![screenshot](https://user-images.githubusercontent.com/130286/80558424-738d7300-8a2e-11ea-9777-4d5fc72788b3.png)

This repository contains the sourcecode for the [MAAS](https://maas.io) web app, maas-ui.

It is comprised of the following [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/):

- _ui_: the react maas client (all new work should be in this workspace).
- _legacy_: the angularjs maas client.
- _root_: a single-spa app, providing top-level routing between both _ui_ and _legacy_.
- _shared_: code shared between both legacy and ui.
- _proxy_: a proxying express project, used for serving both legacy and ui projects in development.

## Contributing

Community contributions are most welcome, and there are a number of ways to participate:

- [Submit bugs and feature requests](https://github.com/canonical-web-and-design/maas-ui/issues)
- [Assist with code review](https://github.com/canonical-web-and-design/maas-ui/pulls)
- [Submit bugs for the MAAS website](https://github.com/canonical-web-and-design/maas.io)
- [Contribute to MAAS documentation](https://maas.io/docs/writing-guide)

When submitting a PR, please take note that MAAS UI uses the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) format. To help you conform to this, you can run `yarn commit` instead of `git commit` for an interactive prompt.

Please see [HACKING](HACKING.md) for details on setting up a MAAS UI development environment.

## Feedback

- Ask a question about MAAS on [Discourse](https://discourse.maas.io/).
- File a [MAAS UI issue](https://github.com/canonical-web-and-design/maas-ui/issues/new/choose).
- File a [MAAS issue](https://bugs.launchpad.net/maas/+filebug).

## Related Projects

### MAAS

MAAS server source and issue tracking [can be found on Launchpad](https://launchpad.net/maas).

### LXD

[LXD](https://github.com/lxc/lxd) is a next generation system container and virtual machine manager, used extensively by MAAS.

## Built With

- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [single-spa](https://single-spa.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Angularjs](https://angularjs.org/) (legacy)

## Team Members

[MAAS UI](https://github.com/orgs/canonical/teams/maas-ui/members) and [Canonical Web & Design](https://github.com/orgs/canonical/teams/web-and-design/members)

## Code of Conduct

This project adopts the [Ubuntu Code of Conduct](https://ubuntu.com/community/code-of-conduct).

## License

Code licensed AGPLv3 by Canonical Ltd.

With ♥ from Canonical
