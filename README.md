# maas-ui

This is repository contains sourcecode for the [MAAS](http://maas.io) web  frontend.

[![CircleCI](https://circleci.com/gh/canonical-web-and-design/maas-ui/tree/master.svg?style=svg)](https://circleci.com/gh/canonical-web-and-design/maas-ui/tree/master)

It is comprised of the following [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/):

  - *legacy*: the angularjs maas client.
  - *ui*: the new react maas client (all new work should be in this workspace).
  - *shared*: code shared between both legacy and ui.
  - *proxy*: a proxying express project, used for serving both legacy and ui projects in development.

## Adding a new workspace

To add a new workspace, edit `package.json` and add the project's directory name to the `workspaces` array.

To import modules from existing projects in your new project, add the dependant projects to your projects dependencies in `package.json`.

## Component documentation

To view react component documentation run `./run exec --expose-port 6060 yarn docs`.

## maas-ui development setup

**Note: You will need access to an instance of MAAS running in order to run maas-ui.**

Although we recommend developing against an already deployed MAAS,
to setup a local MAAS in a container, you can follow the steps in this [guide](https://docs.google.com/document/d/17Rc_wpaOylXADmh6yIDlGjOVzaAgyLWe3SbnK3C5SL0/).

### Generate an SSH key in your container (LXD and multipass)

**Note: If you intend to develop against a local MAAS, the following instructions should be run in the container running MAAS.**

Inside your container (LXD or multipass) [generate a new SSH key](https://help.github.com/en/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and [add it to your Github account](https://help.github.com/en/articles/adding-a-new-ssh-key-to-your-github-account).

### Clone the repository

Inside your MAAS container (LXD or multipass), clone the maas-ui repository. If you are going to be developing on maas-ui then do the following:

```
git clone -o upstream git@github.com:canonical-web-and-design/maas-ui
cd maas-ui
git remote add origin git@github.com:<github-username>/maas-ui
```

Otherwise run:

```
git clone git@github.com:<github-username>/maas-ui
```

### Edit local config

By default maas-ui will connect to `karura.internal` which requires Canonical VPN access. If you wish to develop against a different MAAS then you can create a local env:

```
cp proxy/.env proxy/.env.local
```

Update the contents of that file to:

```
MAAS_URL="http://<your-maas-ip>:5240/"
```


### Install Docker inside your container (LXD and multipass)

The simplest way is to use [the convenience script](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-using-the-convenience-script). Once the script has run you will need to add your user to the docker group:

```
sudo usermod -aG docker $USER
newgrp docker
```

[Install Docker inside your container](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

[If on a Mac, download the Docker client](https://docs.docker.com/v17.12/docker-for-mac/install/#download-docker-for-mac)

### Running

From the root of the MAAS UI project run:

```
./run
```

From here you should be able to view the project at &lt;your-local-maas-ip>:8400/MAAS/

## Building

Ensure both node (current LTS) and yarn are installed.

From the root of the MAAS UI project run:

```
yarn build-all
```

Optimised production bundles for both `ui` and `legacy` will be built, and output to `./build`.
