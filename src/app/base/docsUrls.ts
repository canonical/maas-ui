const docsUrls = {
  aboutNativeTLS:
    "https://maas.io/docs/how-to-enable-tls-encryption#heading--about-maas-native-tls",
  addMachines:
    "https://maas.io/docs/how-to-make-machines-available#heading--how-to-create-delete-and-configure-machines",
  addNodesViaChassis:
    "https://maas.io/docs/how-to-make-machines-available#heading--how-to-add-machines-via-a-chassis",
  autoRenewTLSCert:
    "https://maas.io/docs/how-to-enable-tls-encryption#heading--about-auto-renewal-for-certificates",
  cloudInit:
    "https://maas.io/docs/how-to-customise-machines#heading--cloud-init",
  configurationJourney:
    "https://maas.io/docs/how-to-install-maas#heading--configure-maas",
  customisingDeployedMachines:
    "https://maas.io/docs/about-customising-machines#heading--about-customising-deployed-machines",
  dhcp: "https://maas.io/docs/how-to-enable-dhcp#heading--how-to-manage-maas-dhcp",
  images: "https://maas.io/docs/about-images",
  ipmi: "https://maas.io/docs/power-management-reference#heading--ipmi",
  ipRanges:
    "https://maas.io/docs/how-to-enable-dhcp#heading--how-to-manage-ip-ranges",
  kvmIntroduction: "https://maas.io/docs/about-vm-hosting",
  networkDiscovery:
    "https://maas.io/docs/about-networking#heading--about-network-discovery",
  rackController: "https://maas.io/docs/how-to-adjust-your-controllers",
  sshKeys: "https://maas.io/docs/how-to-manage-user-accounts#heading--ssh-keys",
  tagsAutomatic:
    "https://maas.io/docs/how-to-tag-machines#heading--automatic-tags",
  tagsKernelOptions:
    "https://maas.io/docs/how-to-tag-machines#heading--kernel-options",
  tagsXpathExpressions:
    "https://maas.io/docs/how-to-tag-machines#heading--xpath-expressions",
  vaultIntegration:
    // "https://maas.io/docs/how-to-integrate-with-vault#heading--enabling-vault", <-- TODO: Enable this link when the page is ready
    "https://maas.io/docs",
} as const;

export default docsUrls;
