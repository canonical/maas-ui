# Integration testing with cypress

[Cypress](https://www.cypress.io/) is an end-to-end Javascript testing framework that executes in the browser, and therefore in the same run loop as the device under test. It includes features such as time travel (through the use of UI snapshots), real-time reloads and automatic/intuitive waiting.

⚠️ Cypress tests assume that the user `admin` with password `test` exists on the maas server.

## Running headless tests

To run headless Cypress tests, enter the following command from the root of the project:

```shell
yarn test-cypress
```

This will automatically start legacy, ui and proxy servers and run the Cypress tests, in which results are logged to the console. After running the tests, the servers and process will close.

## Developing cypress tests

### On your host machine

This is the most straightforward process, and generally what we would recommend.

1. Ensure a development server is running

```shell
yarn serve
```

2. Start cypress

Then open the Cypress Test Runner by running:

```shell
cd integration
yarn cypress-open
```

You should then see a list of test specs in maas-ui. You can run all interactive tests by clicking "Run all specs" in the top-right of the window.

### On LXD or Multipass

Running Cypress in LXD or multipass is _not_ recommended as the setup is more complex, but if you'd rather not run cypress on your host, the follow options are available:

#### LXD

You will need to create or update an LXD profile that allows running GUI applications. If creating a new profile, run:

```shell
lxc profile create gui
```

Open the profile config:

```shell
lxc profile edit gui
```

And replace with the following yaml:

```yaml
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

```shell
lxc launch --profile default --profile gui ubuntu:18.04 container-name
```

Or if you have an existing LXD container, you can update the profile by running:

```shell
lxc profile assign existing-container default,gui
lxc restart existing-container
```

Install the following dependencies in your container, which are required for Cypress to relay information to the host machine:

```shell
sudo apt-get install xvfb libgtk-3-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
```

You may need to install Cypress explicitly if you've set up file-sharing with your host/container.

```shell
node_modules/.bin/cypress install
```

You should now be able to open the Cypress Test Runner in your container by running:

```shell
yarn cypress-open
```

If you encounter an error with file watchers e.g. `ENOSPC: System limit for number of file watchers reached`, run:

```shell
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

For more information on running GUI applications in LXD, refer to [this blog post](https://blog.simos.info/how-to-easily-run-graphics-accelerated-gui-apps-in-lxd-containers-on-your-ubuntu-desktop/).

#### Multipass

Install the following dependencies in your multipass, which are required for Cypress to relay information to the host machine:

```shell
sudo apt-get install xvfb libgtk-3-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
```

Next, validate whether ssh on the multipass VM is configured to forward X11 communication. Ensure you have the following values in `/etc/ssh/ssh_config`:

```shell
ForwardX11 yes
ForwardX11Trusted yes
```

And the following values in `/etc/ssh/sshd_config`:

```shell
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

```shell
brew cask install xquartz
```

Or directly from the website [here](https://www.xquartz.org/). You will now need to restart your machine.

Start XQuartz using:

```shell
open -a XQuartz
```

In the XQuartz preferences, go to the “Security” tab and make sure you’ve got “Allow connections from network clients” ticked.

##### Establish connection

Establish an ssh connection from your graphical desktop to the remote X client using the “-Y” switch for trusted X11 forwarding. Note that you may need to add your host's public SSH key to the multipass' list of allowed hosts.

```shell
ssh -Y multipass@<multipass-ip>
```

You should now be able to run the Cypress Test Runner by running:

```shell
yarn cypress-open
```
