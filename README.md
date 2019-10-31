# MAAS Frontend

This is a mono repo for MAAS frontend projects.

[![CircleCI](https://circleci.com/gh/canonical-web-and-design/maas-ui/tree/master.svg?style=svg)](https://circleci.com/gh/canonical-web-and-design/maas-ui/tree/master)

# Projects

## UI

This is a React frontend. New work should be done here where possible.

To view component docs run `./run exec --expose-port 6060 yarn docs`.

# Adding a new project

To add a new project, edit `package.json` and add the project's directory name to the `workspaces` array.

To import modules from existing projects in your new project, add the dependant projects to your projects dependencies in `package.json`. See [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) for details.

# Setting up maas-ui

**Note: You will need an instance of MAAS running in order to run maas-ui.**

## Generate an SSH key in your container (LXD and multipass)

**Note: The following instructions should be run in the same container that also contains your local MAAS.**

Inside your container (LXD or multipass) [generate a new SSH key](https://help.github.com/en/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and [add it to your Github account](https://help.github.com/en/articles/adding-a-new-ssh-key-to-your-github-account).

## Clone the repository

Inside your MAAS container (LXD or multipass) go to the directory that contains your local MAAS, e.g.

```
cd /path/to/directory
```

From there clone the maas-ui repository. If you are going to be developing on maas-ui then do the following:

```
git clone -o upstream git@github.com:canonical-web-and-design/maas-ui
cd maas-ui
git remote add origin git@github.com:<github-username>/maas-ui
```

Otherwise run:

```
git clone git@github.com:<github-username>/maas-ui
```

## Setup local config

By default maas-ui will connect to `karura.internal`. If you wish to develop against a different MAAS then you can create a local env config:

```
cp proxy/.env proxy/.env.local
```

Update the contents of that file to:

```
MAAS_URL="http://<your-local-maas-ip>:5240/"
```

To setup MAAS locally, you can follow the steps in this [guide](https://docs.google.com/document/d/17Rc_wpaOylXADmh6yIDlGjOVzaAgyLWe3SbnK3C5SL0/).

## Install Docker inside your container (LXD and multipass)

The simplest way is to use [the convenience script](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-using-the-convenience-script). Once the script has run you will need to add your user to the docker group:

```
sudo usermod -aG docker $USER
newgrp docker
```

[Install Docker inside your container](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

[If on a Mac, download the Docker client](https://docs.docker.com/v17.12/docker-for-mac/install/#download-docker-for-mac)

# Running maas-ui

From the root of the MAAS UI project run:

```
./run
```

From here you should be able to view the project at &lt;your-local-maas-ip>:8400/MAAS/
