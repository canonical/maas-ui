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

Create a local env config:

```
cp ui/.env.development ui/.env.development.local
```

Update the contents of that file to:

```
REACT_APP_BASENAME="/MAAS/settings"
REACT_APP_MAAS_URL="http://<your-local-maas-ip>:5240/MAAS"
REACT_APP_WEBSOCKET_URL="ws://<your-local-maas-ip>:5240/MAAS/ws"
```

## Install Docker inside your container (LXD and multipass)

The simplest way is to use [the convenience script](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-using-the-convenience-script). Once the script has run you will need to add your user to the docker group:

```
sudo usermod -aG docker $USER
newgrp docker
```

[Install Docker inside your container](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

# Running maas-ui

From the root of the MAAS UI project run:

```
./run
```

From here you should be able to view the project at &lt;your-local-maas-ip>:8000

# Changelog Process

When proposing changes to maas-ui, ensure you update CHANGELOG.md appropriately, describing your changes under either a "Fixed", "Added", "Removed", or "Changed" subheading under "Unreleased".

See [keep a changelog](https://keepachangelog.com/en/1.0.0/) for details.

# Release Process

Note: Releasing is not currently supported by the `run` script (see [issue](https://github.com/canonical-web-and-design/generator-canonical-webteam/issues/116) for details), so please perform the following directly in a container or on your host.

1. Update CHANGELOG.md, moving unreleased changes to a new heading for the release version.
2. Run `yarn release ${version}`. (e.g. `yarn release 0.1.1`, note no 'v'). Please ensure correct [semantic versioning](https://semver.org/).
3. Make a commit with `git commit -am "Release v${version}."`.
4. Push the release with `git push --tags <upstream> master`.
5. [Draft a new release on Github](https://github.com/canonical-web-and-design/maas-ui/releases/new) using the new version as the *Release title*, copying the changelog section for the new release into the *description* field, and uploading the production tarball in `./dist`.
