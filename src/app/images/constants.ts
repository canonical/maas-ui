export const MAAS_IO_DEFAULTS = {
  url: "http://images.maas.io/ephemeral-v3/stable/",
  keyring_filename:
    "/snap/maas/current/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg",
  keyring_data: "",
} as const;

export const OPERATING_SYSTEM_NAMES = [
  {
    label: "Ubuntu",
    value: "Ubuntu",
  },
  {
    label: "Ubuntu Core",
    value: "Ubuntu Core",
  },
  {
    label: "CentOS",
    value: "CentOS",
  },
  {
    label: "RHEL",
    value: "RHEL",
  },
  {
    label: "Custom",
    value: "Custom",
  },
  {
    label: "Windows",
    value: "Windows",
  },
  {
    label: "SUSE",
    value: "SUSE",
  },
  {
    label: "ESXi",
    value: "ESXi",
  },
  {
    label: "OL",
    value: "OL",
  },
] as const;
