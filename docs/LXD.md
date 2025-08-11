# How to set up a local MAAS with LXD

Having a locally running MAAS where you can deploy your own virtual machines can be useful for testing things in the UI.
This tutorial will take you through the process of setting up MAAS in a LXD container.

## Prerequisites

- Hardware that meets the [minimum requirements](https://maas.io/docs/reference-installation-requirements)
- Knowledge of Ubuntu and basic Linux commands

### Install and configure LXD

1. Install LXD

    ```sh
    sudo snap install lxd
    ```


2. Initialise LXD

    ```sh
    sudo lxd init --auto
    ```

   You can remove the `--auto` flag if you want to go through the initialisation steps yourself - the defaults are fine
   for
   the purpose of this setup.


3. Check your network configuration and note the `lxdbr0` IP address

    ```sh
    ip a
    ```

   The output should look something like this:

    ```
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
        link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
        inet 127.0.0.1/8 scope host lo
           valid_lft forever preferred_lft forever
        inet6 ::1/128 scope host noprefixroute 
           valid_lft forever preferred_lft forever
    2: wlp0s20f3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
        link/ether 70:15:fb:9e:0f:de brd ff:ff:ff:ff:ff:ff
        inet 192.168.1.72/24 brd 192.168.1.255 scope global dynamic noprefixroute wlp0s20f3
           valid_lft 80972sec preferred_lft 80972sec
        inet6 fe80::9379:e5b7:803e:2958/64 scope link noprefixroute 
           valid_lft forever preferred_lft forever
    55: lxdbr0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default qlen 1000
        link/ether 00:16:3e:ce:4e:ff brd ff:ff:ff:ff:ff:ff
        inet 10.128.58.1/24 scope global lxdbr0
           valid_lft forever preferred_lft forever
        inet6 fd42:6002:990e:aafc::1/64 scope global 
           valid_lft forever preferred_lft forever
    ```

   In this example, `lxdbr0` has IP "10.128.58.1" and the main network interface is `wlp0s20f3`. Use these values in the
   firewall configuration below.


4. Configure your firewall. Either disable it completely:

    ```sh
    sudo ufw disable
    ```

   Or configure specific rules to allow LXD communication:

    ```sh
    sudo ufw allow in on lxdbr0
    sudo ufw allow out on lxdbr0
    sudo ufw allow in on lxdbr0 proto udp to 10.128.58.1 port 53
    sudo ufw allow out on lxdbr0 proto udp from 10.128.58.1 port 53
    sudo ufw allow in on lxdbr0 proto udp from 10.128.58.1 port 67 to 10.128.58.0/24 port 68
    sudo ufw allow out on lxdbr0 proto udp from 10.128.58.0/24 port 68 to 10.128.58.1 port 67
    sudo ufw route allow in on lxdbr0 out on wlp0s20f3
    sudo ufw route allow in on wlp0s20f3 out on lxdbr0
    ```

   Replace `10.128.58.1` and `10.128.58.0/24` with your actual `lxdbr0` IP and network, and replace `wlp0s20f3` with
   your actual network interface name from step 3.


5. Set the HTTPS address for LXD

    ```sh
    sudo lxc config set core.https_address [::]:8443
    ```

---

## Choose Your Setup Type

Now you need to decide what type of MAAS setup you want:

- KVM Managing Instance: A MAAS setup that can provision virtual machines on your host system
- Sample Data Demo Instance: A MAAS setup with pre-populated sample data for testing and demonstration

---

## KVM Managing Instance

This setup enables MAAS to provision virtual machines on your host system.

### Create KVM network and profile

6. Create and configure the `maas-kvm` network for VM provisioning

    ```sh
    sudo lxc network create maas-kvm
    sudo lxc network edit maas-kvm
    ```

   Paste the following config, and save:

    ```yaml
    name: maas-kvm
    description: ""
    type: bridge
    managed: true
    status: Created
    config:
      ipv4.address: 10.20.0.1/24
      ipv4.dhcp: "false"
      ipv4.nat: "true"
      ipv6.address: none
    used_by: []
    locations:
      - none
    ```


7. Create and edit the `maas-container` profile

    ```sh
    sudo lxc profile create maas-container
    sudo lxc profile edit maas-container
    ```

   Paste the following config, and save:

    ```yaml
    name: maas-container
    description: MAAS region container
    config: {}
    devices:
      eth0:
        network: lxdbr0
        type: nic
      eth1:
        network: maas-kvm
        type: nic
      root:
        path: /
        pool: default
        type: disk
    ```

### Launch and configure container

8. Launch an Ubuntu container with the `maas-container` profile

    ```sh
    sudo lxc launch ubuntu:noble maas-kvm-host -p default -p maas-container
    ```


9. Enter the shell for the container, and switch to the `ubuntu` user

    ```shell
    sudo lxc exec maas-kvm-host -- su ubuntu
    ```


10. Inside the container, create a netplan config to give the container an address on the `maas-kvm` network

    ```sh
    sudo nano /etc/netplan/99-maas-kvm-net.yaml
    ```

    Paste the following config, and save:

    ```yaml
    network:   
      ethernets:  
        eth1:  
          addresses: [10.20.0.2/24]
      version: 2
    ```


11. Apply the new netplan configuration

    ```sh
    sudo netplan apply
    ```

### Install and initialise MAAS

12. Install the latest MAAS snap, and the test database

    ```sh 
    sudo snap install maas --channel=latest/edge
    sudo snap install maas-test-db --channel=latest/edge
    ```


13. Initialise MAAS with the following command

    ```sh
    sudo maas init region+rack --maas-url="http://10.20.0.2:5240/MAAS" --database-uri maas-test-db:///
    ```

    Take note of the `maas-url` here, you'll need it to log into the UI later.


14. Create your admin user

    ```sh
    sudo maas createadmin
    ```

### Configure your host machine as a KVM host in MAAS

15. Paste the `maas-url` from step 15 into your browser, and log into MAAS UI. Make sure you import your SSH keys from
    Launchpad or GitHub
16. Click on "Subnets" in the navigation, and then click on "10.20.0.0/24". Make sure the gateway IP is "10.20.0.1"
17. Go to the VLAN for this subnet (it should show up as "untagged"), and reserve a dynamic range from 10.20.0.100 to
    10.20.0.200
18. Click "Configure DHCP", check "MAAS provides DHCP", and make sure the IP range you just reserved shows up in the
    form, then submit the form.
19. Click on "LXD" in the navigation, then click "Add LXD host" and fill in the form. You can paste the IP address from
    the step 3 into the "LXD address" field. Select "Generate new certificate and key", and click "Next".
20. Run the command shown in the side panel on your host machine to add the newly generated certificate to LXD, then
    click "Check authentication".
21. Select "Add new project" and give it a name - this is where MAAS will deploy all new VMS created with this host.
    Then click "Save LXD host"

And that's a wrap! You should now be able to compose virtual machines on your host using MAAS.