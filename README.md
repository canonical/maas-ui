# maas-ui

This is repository contains sourcecode for the [MAAS](http://maas.io) web  frontend.

[![CircleCI](https://circleci.com/gh/canonical-web-and-design/maas-ui/tree/master.svg?style=svg)](https://circleci.com/gh/canonical-web-and-design/maas-ui/tree/master)

![CI](https://github.com/canonical-web-and-design/maas-ui/workflows/CI/badge.svg)

It is comprised of the following [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/):

  - *legacy*: the angularjs maas client.
  - *ui*: the new react maas client (all new work should be in this workspace).
  - *shared*: code shared between both legacy and ui.
  - *proxy*: a proxying express project, used for serving both legacy and ui projects in development.

## Adding a new workspace

To add a new workspace, edit `package.json` and add the project's directory name to the `workspaces` array.

To import modules from existing projects in your new project, add the dependant projects to your projects dependencies in `package.json`.

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

The simplest way is to use [dotrun snap](https://snapcraft.io/dotrun). Once installed you can run `dotrun` in the root of this project.

### macOS

#### VPN Configuration

To connect to a remote MAAS over the VPN, you'll need to configure *nat* on your macOS host:

1. run `ifconfig` and make note of the `utun` interfaces.
2. For every `utun` interface, add the following line to `/etc/pf.conf` directly after any existing `nat-anchor` or `nat` commands (the order is significant):

```
nat on utun0 from bridge100:network to any -> (utun0)
```

3. Run `sudo pfctl -f /etc/pf.conf` to update configuration.
4. You should be able to `ping karura.internal` from your maas multipass.

Be aware that this may prevent reaching hosts on your internal network. You can of course comment out the `nat` configuration and rerun `sudo pfctl -f /etc/pf.conf` to reset everything.

#### Docker

If running `dotrun` from your macOS, you'll need to [Use multipass to creeate an Ubuntu VM](https://multipass.run).

### Running

To run the MAAS UI project through a Docker container, from the root of the MAAS UI project run:

```
dotrun
```

If you get babel errors then you should run `yarn clean-all` and retry.

Otherwise you can run the project on your host machine directly if you have node and yarn installed, using:

```
yarn serve
```

From here you should be able to view the project at &lt;your-local-maas-ip&gt;:8400/MAAS/

## Building

Ensure both node (current LTS) and yarn are installed.

From the root of the MAAS UI project run:

```
yarn build-all
```

Optimised production bundles for both `ui` and `legacy` will be built, and output to `./build`.

## Testing with Cypress

[Cypress](https://www.cypress.io/) is an end-to-end Javascript testing framework that executes in the browser, and therefore in the same run loop as the device under test. It includes features such as time travel (through the use of UI snapshots), real-time reloads and automatic/intuitive waiting.

### Running headless tests

To run headless Cypress tests, enter the following command from the root of the project:

```
yarn test-cypress
```

This will automatically start legacy, ui and proxy servers and run the Cypress tests, in which results are logged to the console. After running the tests, the servers and process will close.

### Interactive testing

By launching the Cypress Test Runner, you will be able to to see commands as they execute while also viewing the UI while it's being tested. Note that because the Cypress Test Runner is a graphical application, launching it in a container or VM will require some extra steps because you will need to forward the XVFB messages from Cypress out of the container into an X11 server running on the host machine.

#### Interactive testing on host machine

If developing directly on your host machine, simply run maas-ui in development as normal:

```
yarn serve
```

Then open the Cypress Test Runner by running:

```
yarn cypress-open
```

You should then see a list of test specs in maas-ui. You can run all interactive tests by clicking "Run all specs" in the top-right of the window.

#### Interactive testing in LXD

You will need to create or update an LXD profile that allows running GUI applications. If creating a new profile, run:

```
lxc profile create gui
```

Open the profile config:

```
lxc profile edit gui
```

And replace with the following yaml:

``` yaml
config:
  environment.DISPLAY: :0
  raw.idmap: both 1000 1000
  user.user-data: |
    #cloud-config
    runcmd:
      - 'sed -i "s/; enable-shm = yes/enable-shm = no/g" /etc/pulse/client.conf'
      - 'echo export PULSE_SERVER=unix:/tmp/.pulse-native | tee --append /home/ubuntu/.profile'
    packages:
      - x11-apps
      - mesa-utils
      - pulseaudio
description: GUI LXD profile
devices:
  PASocket:
    path: /tmp/.pulse-native
    source: /run/user/1000/pulse/native
    type: disk
  X0:
    path: /tmp/.X11-unix/X0
    source: /tmp/.X11-unix/X0
    type: disk
  mygpu:
    type: gpu
name: gui
used_by:
```

Now either launch a new container with this profile, for example using Ubuntu 18.04:

```
lxc launch --profile default --profile gui ubuntu:18.04 container-name
```

Or if you have an existing LXD container, you can update the profile by running:

```
lxc profile assign existing-container default,gui
lxc restart existing-container
```

Install the following dependencies in your container, which are required for Cypress to relay information to the host machine:

```
sudo apt-get install xvfb libgtk-3-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
```

You may need to install Cypress explicitly if you've set up file-sharing with your host/container.

```
node_modules/.bin/cypress install
```

You should now be able to open the Cypress Test Runner in your container by running:

```
yarn cypress-open
```

If you encounter an error with file watchers e.g. `ENOSPC: System limit for number of file watchers reached`, run:

```
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

For more information on running GUI applications in LXD, refer to [this blog post](https://blog.simos.info/how-to-easily-run-graphics-accelerated-gui-apps-in-lxd-containers-on-your-ubuntu-desktop/).

#### Interactive testing in multipass

Install the following dependencies in your multipass, which are required for Cypress to relay information to the host machine:

```
sudo apt-get install xvfb libgtk-3-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
```

Next, validate whether ssh on the multipass VM is configured to forward X11 communication. Ensure you have the following values in `/etc/ssh/ssh_config`:

```
ForwardX11 yes
ForwardX11Trusted yes
```

And the following values in `/etc/ssh/sshd_config`:

```
X11Forwarding yes
X11DisplayOffset 10
PrintMotd no
TCPKeepAlive yes
```

The following steps will differ depending on the OS of the host system.

##### Ubuntu setup

Since you are running from an Ubuntu graphical desktop then you already have an X11 server running locally so no further installation is necessary.

##### MacOS setup

First install XQuartz, which is the Mac version of X11. You can install XQuartz using homebrew with:

```
brew cask install xquartz
```

Or directly from the website [here](https://www.xquartz.org/). You will now need to restart your machine.

Start XQuartz using:

```
open -a XQuartz
```

In the XQuartz preferences, go to the “Security” tab and make sure you’ve got “Allow connections from network clients” ticked.

##### Establish connection

Establish an ssh connection from your graphical desktop to the remote X client using the “-Y” switch for trusted X11 forwarding. Note that you may need to add your host's public SSH key to the multipass' list of allowed hosts.

```
ssh -Y multipass@<multipass-ip>
```

You should now be able to run the Cypress Test Runner by running:

```
yarn cypress-open
```
