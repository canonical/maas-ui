# MAAS Frontend

This is a mono repo for MAAS frontend projects.

[![CircleCI](https://circleci.com/gh/canonical-web-and-design/maas-ui/tree/master.svg?style=svg)](https://circleci.com/gh/canonical-web-and-design/maas-ui/tree/master)

# Projects

## UI

This is a React frontend. New work should be done here where possible.
To run this project execute `cd ui` then `./run`.

# Adding a new project

To add a new project, edit `package.json` and add the project's directory name to the `workspaces` array.

To import modules from existing projects in your new project, add the dependant projects to your projects dependencies in `package.json`. See [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) for details.
