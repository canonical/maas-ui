import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns value of an object in an array, given a certain name.
 * @param {Array.<Object>} arr - Array to search for name.
 * @param {String} name - Name paramenter of the object to search for.
 * @returns {*} Value parameter of found object.
 */
const getValueFromName = (arr: TSFixMe, name: TSFixMe): TSFixMe => {
  const found = arr.find((item: TSFixMe) => item.name === name);
  if (found) {
    return found.value;
  }
  return;
};

/**
 * Returns choices of an object in an array, given a certain name.
 * @param {Array.<Object>} arr - Array to search for name.
 * @param {String} name - Name paramenter of the object to search for.
 * @returns {Array.<Object>} Available choices.
 */
const getOptionsFromName = (arr: TSFixMe, name: TSFixMe): TSFixMe => {
  const found = arr.find((item: TSFixMe) => item.name === name);
  if (found && found.choices) {
    return found.choices.map((choice: TSFixMe) => ({
      value: choice[0],
      label: choice[1],
    }));
  }
  return;
};

/**
 * Returns list of all MAAS configs
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all state.config.items.
 */
const all = (state: RootState): TSFixMe => state.config.items;

/**
 * Returns true if config is loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Config is loading.
 */
const loading = (state: RootState): boolean => state.config.loading;

/**
 * Returns true if config has been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Config has loaded.
 */
const loaded = (state: RootState): boolean => state.config.loaded;

/**
 * Returns true if config is saving.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Config is saving.
 */
const saving = (state: RootState): boolean => state.config.saving;

/**
 * Returns true if config has saved.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Config has saved.
 */
const saved = (state: RootState): boolean => state.config.saved;

/**
 * Returns the MAAS config for default storage layout.
 * @param {Object} state - The redux state.
 * @returns {String} Default storage layout.
 */
const defaultStorageLayout = createSelector([all], (configs) =>
  getValueFromName(configs, "default_storage_layout")
);

/**
 * Returns the possible storage layout options reformatted as objects.
 * @param {Object} state - The redux state.
 * @returns {Array} Storage layout options.
 */
const storageLayoutOptions = createSelector([all], (configs) =>
  getOptionsFromName(configs, "default_storage_layout")
);

/**
 * Returns the MAAS config for enabling disk erase on release.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Enable disk erasing on release.
 */
const enableDiskErasing = createSelector([all], (configs) =>
  getValueFromName(configs, "enable_disk_erasing_on_release")
);

/**
 * Returns the MAAS config for enabling disk erase with secure erase.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Enable disk erasing with secure erase.
 */
const diskEraseWithSecure = createSelector([all], (configs) =>
  getValueFromName(configs, "disk_erase_with_secure_erase")
);

/**
 * Returns the MAAS config for enabling disk erase with quick erase.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Enable disk erasing with quick erase.
 */
const diskEraseWithQuick = createSelector([all], (configs) =>
  getValueFromName(configs, "disk_erase_with_quick_erase")
);

/**
 * Returns the MAAS config for http proxy url.
 * @param {Object} state - The redux state.
 * @returns {String} HTTP proxy.
 */
const httpProxy = createSelector([all], (configs) =>
  getValueFromName(configs, "http_proxy")
);

/**
 * Returns the MAAS config for enabling http proxy.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Enable HTTP proxy.
 */
const enableHttpProxy = createSelector([all], (configs) =>
  getValueFromName(configs, "enable_http_proxy")
);

/**
 * Returns the MAAS config for using peer proxy.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Use peer proxy.
 */
const usePeerProxy = createSelector([all], (configs) =>
  getValueFromName(configs, "use_peer_proxy")
);

/**
 * Returns the proxy type, given other proxy config.
 * @param {Object} state - The redux state.
 * @returns {String} Proxy type.
 */
const proxyType = createSelector(
  [httpProxy, enableHttpProxy, usePeerProxy],
  (httpProxy, enableHttpProxy, usePeerProxy) => {
    if (enableHttpProxy) {
      if (httpProxy) {
        if (usePeerProxy) {
          return "peerProxy";
        } else {
          return "externalProxy";
        }
      } else {
        return "builtInProxy";
      }
    }
    return "noProxy";
  }
);

/**
 * Returns the MAAS config for MAAS name.
 * @param {Object} - The redux state.
 * @returns {String} Then MAAS name.
 */
const maasName = createSelector([all], (configs) =>
  getValueFromName(configs, "maas_name")
);

/**
 * Returns the MAAS config for MAAS uuid.
 * @param {Object} - The redux state.
 * @returns {String} Then MAAS uuid.
 */
const uuid = createSelector([all], (configs) =>
  getValueFromName(configs, "uuid")
);

/**
 * Returns the MAAS config for enable analytics.
 * @param {Object} - The redux state.
 * @returns {Boolean} Enable analytics.
 */
const analyticsEnabled = createSelector([all], (configs) =>
  getValueFromName(configs, "enable_analytics")
);

/**
 * Returns the MAAS config for default distro series.
 * @param {Object} state - The redux state.
 * @returns {String} Default distro series.
 */
const commissioningDistroSeries = createSelector([all], (configs) =>
  getValueFromName(configs, "commissioning_distro_series")
);

/**
 * Returns the possible distro series options reformatted as objects.
 * @param {Object} state - The redux state.
 * @returns {Array} Distro series options.
 */
const distroSeriesOptions = createSelector([all], (configs) =>
  getOptionsFromName(configs, "commissioning_distro_series")
);

/**
 * Returns the MAAS config for default min kernel version.
 * @param {object} state - The redux state.
 * @returns {String} Default min kernal version.
 */
const defaultMinKernelVersion = createSelector([all], (configs) =>
  getValueFromName(configs, "default_min_hwe_kernel")
);

/* Returns the MAAS config for enabling DNSSEC validation of upstream zones.
 * @param {Object} state - The redux state.
 * @returns {String} DNSSEC validation type.
 */
const dnssecValidation = createSelector([all], (configs) =>
  getValueFromName(configs, "dnssec_validation")
);

/**
 * Returns the possible DNSSEC validation options reformatted as objects.
 * @param {Object} state - The redux state.
 * @returns {Array} DNSSEC validation options.
 */
const dnssecOptions = createSelector([all], (configs) =>
  getOptionsFromName(configs, "dnssec_validation")
);

/**
 * Returns the MAAS config for the list of external networks that will be allowed to use MAAS for DNS resolution.
 * @param {Object} state - The redux state.
 * @returns {String} External networks.
 */
const dnsTrustedAcl = createSelector([all], (configs) =>
  getValueFromName(configs, "dns_trusted_acl")
);

/**
 * Returns the MAAS config for upstream DNS.
 * @param {Object} state - The redux state.
 * @returns {String} Upstream DNS(s).
 */
const upstreamDns = createSelector([all], (configs) =>
  getValueFromName(configs, "upstream_dns")
);

/**
 * Returns the MAAS config for NTP servers.
 * @param {Object} state - The redux state.
 * @returns {String} NTP server(s).
 */
const ntpServers = createSelector([all], (configs) =>
  getValueFromName(configs, "ntp_servers")
);

/**
 * Returns the MAAS config for only enabling external NTP servers.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Enable external NTP servers only.
 */
const ntpExternalOnly = createSelector([all], (configs) =>
  getValueFromName(configs, "ntp_external_only")
);

/**
 * Returns the MAAS config for remote syslog server to forward machine logs.
 * @param {Object} state - The redux state.
 * @returns {String} Remote syslog server.
 */
const remoteSyslog = createSelector([all], (configs) =>
  getValueFromName(configs, "remote_syslog")
);

/**
 * Returns the MAAS config for enabling network discovery.
 * @param {Object} state - The redux state.
 * @returns {String} Enable network discovery.
 */
const networkDiscovery = createSelector([all], (configs) =>
  getValueFromName(configs, "network_discovery")
);

/**
 * Returns the possible network discovery options reformatted as objects.
 * @param {Object} state - The redux state.
 * @returns {Array} Network discovery options.
 */
const networkDiscoveryOptions = createSelector([all], (configs) =>
  getOptionsFromName(configs, "network_discovery")
);

/**
 * Returns the MAAS config for active discovery interval.
 * @param {Object} state - The redux state.
 * @returns {Number} Active discovery interval in ms.
 */
const activeDiscoveryInterval = createSelector([all], (configs) =>
  getValueFromName(configs, "active_discovery_interval")
);

/**
 * Returns the possible active discovery intervals reformatted as objects.
 * @param {Object} state - The redux state.
 * @returns {Array} Active discovery intervals.
 */
const discoveryIntervalOptions = createSelector([all], (configs) =>
  getOptionsFromName(configs, "active_discovery_interval")
);

/**
 * Returns the MAAS config for kernel parameters.
 * @param {Object} state - The redux state.
 * @returns {String} Kernel parameters.
 */
const kernelParams = createSelector([all], (configs) =>
  getValueFromName(configs, "kernel_opts")
);

/**
 * Returns the MAAS config for Windows KMS host.
 * @param {Object} state - The redux state.
 * @returns {String} Windows KMS host.
 */
const windowsKmsHost = createSelector([all], (configs) =>
  getValueFromName(configs, "windows_kms_host")
);

/**
 * Returns the MAAS config for vCenter server.
 * @param {Object} state - The redux state.
 * @returns {String} - vCenter server.
 */
const vCenterServer = createSelector([all], (configs) =>
  getValueFromName(configs, "vcenter_server")
);

/**
 * Returns the MAAS config for vCenter username.
 * @param {Object} state - The redux state.
 * @returns {String} - vCenter username.
 */
const vCenterUsername = createSelector([all], (configs) =>
  getValueFromName(configs, "vcenter_username")
);

/**
 * Returns the MAAS config for vCenter password.
 * @param {Object} state - The redux state.
 * @returns {String} - vCenter password.
 */
const vCenterPassword = createSelector([all], (configs) =>
  getValueFromName(configs, "vcenter_password")
);

/**
 * Returns the MAAS config for vCenter datacenter.
 * @param {Object} state - The redux state.
 * @returns {String} - vCenter datacenter.
 */
const vCenterDatacenter = createSelector([all], (configs) =>
  getValueFromName(configs, "vcenter_datacenter")
);

/**
 * Returns the MAAS config for enable_third_party_drivers
 * @param {Object} state - The redux state
 * @returns {Boolean} - The value of enable_third_party_drivers
 */
const thirdPartyDriversEnabled = createSelector([all], (configs) =>
  getValueFromName(configs, "enable_third_party_drivers")
);

/**
 * Returns the MAAS config for default OS.
 * @param {Object} state - The redux state.
 * @returns {String} Default OS.
 */
const defaultOSystem = createSelector([all], (configs) =>
  getValueFromName(configs, "default_osystem")
);

/**
 * Returns the possible default OS options reformatted as objects.
 * @param {Object} state - The redux state.
 * @returns {Array} Default OS options.
 */
const defaultOSystemOptions = createSelector([all], (configs) =>
  getOptionsFromName(configs, "default_osystem")
);

/**
 * Returns the MAAS config for default distro series.
 * @param {Object} state - The redux state.
 * @returns {String} Default distro series.
 */
const defaultDistroSeries = createSelector([all], (configs) =>
  getValueFromName(configs, "default_distro_series")
);

/**
 * Returns the MAAS config for whether the intro has been completed.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether the intro has been completed
 */
const completedIntro = createSelector([all], (configs) =>
  getValueFromName(configs, "completed_intro")
);

const config = {
  activeDiscoveryInterval,
  all,
  analyticsEnabled,
  commissioningDistroSeries,
  completedIntro,
  defaultDistroSeries,
  defaultMinKernelVersion,
  defaultOSystem,
  defaultOSystemOptions,
  defaultStorageLayout,
  discoveryIntervalOptions,
  diskEraseWithQuick,
  diskEraseWithSecure,
  distroSeriesOptions,
  dnssecOptions,
  dnssecValidation,
  dnsTrustedAcl,
  enableDiskErasing,
  enableHttpProxy,
  httpProxy,
  kernelParams,
  loaded,
  loading,
  maasName,
  networkDiscovery,
  networkDiscoveryOptions,
  ntpExternalOnly,
  ntpServers,
  proxyType,
  remoteSyslog,
  saved,
  saving,
  storageLayoutOptions,
  thirdPartyDriversEnabled,
  upstreamDns,
  usePeerProxy,
  uuid,
  vCenterDatacenter,
  vCenterPassword,
  vCenterServer,
  vCenterUsername,
  windowsKmsHost,
};

export default config;
