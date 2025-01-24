const docsUrls = {
  aboutNativeTLS: "https://maas.io/docs/how-to-implement-tls#enabling-tls-2",
  addMachines: "https://maas.io/docs/how-to-provision-machines",
  addNodesViaChassis:
    "https://maas.io/docs/how-to-manage-machines#add-machines-via-chassis-ui-2",
  autoRenewTLSCert:
    "https://maas.io/docs/how-to-implement-tls#auto-renew-certs-8",
  cloudInit:
    "https://maas.io/docs/how-to-customise-machines#pre-seed-cloud-init-2",
  configurationJourney:
    "https://maas.io/docs/how-to-install-maas#p-9034-maas-ui-setup",
  customisingDeployedMachines: "https://maas.io/docs/how-to-customise-machines",
  dhcp: "https://maas.io/docs/about-dhcp-in-maas",
  ipmi: "https://maas.io/docs/reference-power-drivers#ipmi-6",
  ipRanges: "https://maas.io/docs/how-to-enable-dhcp#create-an-ip-range-ui-2", // broken link, no suitable replacement page that explains IP ranges
  kvmIntroduction: "https://maas.io/docs/how-to-use-lxd-vms",
  networkDiscovery:
    "https://maas.io/docs/how-to-customise-maas-networks#p-9070-network-discovery",
  rackController:
    "https://maas.io/docs/how-to-provision-machines#p-9078-configure-controllers",
  sshKeys: "https://maas.io/docs/how-to-manage-user-access#add-ssh-keys-5",
  tagsAutomatic: "https://maas.io/docs/how-to-manage-tags#automatic-tags-17", // moved to /how-to-use-group-machines, no functioning header link
  tagsKernelOptions:
    "https://maas.io/docs/how-to-manage-tags#update-tag-kernel-options-22", // moved to /how-to-use-group-machines, no functioning header link
  tagsXpathExpressions:
    "https://maas.io/docs/how-to-manage-tags#automatic-tags-17", // no suitable replacement page that explains Xpath expressions
  vaultIntegration: "https://maas.io/docs/how-to-integrate-vault",
  windowsImages:
    "https://maas.io/docs/how-to-build-maas-images#p-17423-building-windows-images-with-packer",
} as const;

export default docsUrls;
