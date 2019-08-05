# Setting up MAAS UI

**Note**: You will need an instance of MAAS running in the same container in order to run MAAS UI.

**Note**: You will need your public and private SSH keys inside your container to be able to clone the repo. For help with this see [ssh-copy-id](https://www.ssh.com/ssh/copy-id).

Inside your MAAS container (either LXD or multipass) go to the parent directory of your MAAS installation, clone the MAAS UI repo and set it's upstream and origin:

```
git clone git@github.com:canonical-web-and-design/maas-ui
cd maas-ui
git remote rename origin upstream
git remote add origin git@github.com:<github-username>/maas-ui
```

Create a local env config (this can be done on the host machine):

```
cp .env.development .env.development.local
```

Update the contents of that file to:

```
REACT_APP_BASENAME="/MAAS/settings"
REACT_APP_MAAS_URL="http://<your-local-maas-ip>:5240/MAAS"
REACT_APP_WEBSOCKET_URL="ws://<your-local-maas-ip>:5240/MAAS/ws"
```

[Install Docker inside your container](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

From the root of the MAAS-UI project run:

```
./run
```

From here you should be able to view the project at `<your-local-maas-ip>:8000`