import { createSelector } from "reselect";

const config = {};

/**
 * Returns value of an object in an array, given a certain name.
 * @param {Array.<Object>} arr - Array to search for name.
 * @param {String} name - Name paramenter of the object to search for.
 * @returns {*} Value parameter of found object.
 */
const getValueFromName = (arr, name) => {
  const found = arr.find(item => item.name === name);
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
const getOptionsFromName = (arr, name) => {
  const found = arr.find(item => item.name === name);
  if (found && found.choices) {
    return found.choices.map(choice => ({
      value: choice[0],
      label: choice[1]
    }));
  }
  return;
};

/**
 * Returns list of all MAAS configs
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all state.config.items.
 */
config.all = state => state.config.items;

/**
 * Returns true if config is loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Config is loading.
 */
config.loading = state => state.config.loading;

/**
 * Returns true if config has been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Config has loaded.
 */
config.loaded = state => state.config.loaded;

/**
 * Returns true if config is saving.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Config is saving.
 */
config.saving = state => state.config.saving;

/**
 * Returns true if config has saved.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Config has saved.
 */
config.saved = state => state.config.saved;

/**
 * Returns the MAAS config for default storage layout.
 * @param {Object} state - The redux state.
 * @returns {String} Default storage layout.
 */
config.defaultStorageLayout = createSelector(
  [config.all],
  configs => getValueFromName(configs, "default_storage_layout")
);

/**
 * Returns the possible storage layout options reformatted as objects.
 * @param {Object} state - The redux state.
 * @returns {Array} Storage layout options.
 */
config.storageLayoutOptions = createSelector(
  [config.all],
  configs => getOptionsFromName(configs, "default_storage_layout")
);

/**
 * Returns the MAAS config for enabling disk erase on release.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Enable disk erasing on release.
 */
config.enableDiskErasing = createSelector(
  [config.all],
  configs => getValueFromName(configs, "enable_disk_erasing_on_release")
);

/**
 * Returns the MAAS config for enabling disk erase with secure erase.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Enable disk erasing with secure erase.
 */
config.diskEraseWithSecure = createSelector(
  [config.all],
  configs => getValueFromName(configs, "disk_erase_with_secure_erase")
);

/**
 * Returns the MAAS config for enabling disk erase with quick erase.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Enable disk erasing with quick erase.
 */
config.diskEraseWithQuick = createSelector(
  [config.all],
  configs => getValueFromName(configs, "disk_erase_with_quick_erase")
);

/**
 * Returns the MAAS config for http proxy url.
 * @param {Object} state - The redux state.
 * @returns {String} HTTP proxy.
 */
config.httpProxy = createSelector(
  [config.all],
  configs => getValueFromName(configs, "http_proxy")
);

/**
 * Returns the MAAS config for enabling http proxy.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Enable HTTP proxy.
 */
config.enableHttpProxy = createSelector(
  [config.all],
  configs => getValueFromName(configs, "enable_http_proxy")
);

/**
 * Returns the MAAS config for using peer proxy.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Use peer proxy.
 */
config.usePeerProxy = createSelector(
  [config.all],
  configs => getValueFromName(configs, "use_peer_proxy")
);

/**
 * Returns the proxy type, given other proxy config.
 * @param {Object} state - The redux state.
 * @returns {String} Proxy type.
 */
config.proxyType = createSelector(
  [config.httpProxy, config.enableHttpProxy, config.usePeerProxy],
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
config.maasName = createSelector(
  [config.all],
  configs => getValueFromName(configs, "maas_name")
);

/**
 * Returns the MAAS config for enable analytics.
 * @param {Object} - The redux state.
 * @returns {Boolean} Enable analytics.
 */
config.analyticsEnabled = createSelector(
  [config.all],
  configs => getValueFromName(configs, "enable_analytics")
);

/**
 * Returns the MAAS config for default distro series.
 * @param {Object} state - The redux state.
 * @returns {String} Default distro series.
 */
config.commissioningDistroSeries = createSelector(
  [config.all],
  configs => getValueFromName(configs, "commissioning_distro_series")
);

/**
 * Returns the possible distro series options reformatted as objects.
 * @param {Object} state - The redux state.
 * @returns {Array} Distro series options.
 */
config.distroSeriesOptions = createSelector(
  [config.all],
  configs => getOptionsFromName(configs, "commissioning_distro_series")
);

/**
 * Returns the MAAS config for default min kernel version.
 * @param {object} state - The redux state.
 * @returns {String} Default min kernal version.
 */
config.defaultMinKernelVersion = createSelector(
  [config.all],
  configs => getValueFromName(configs, "default_min_hwe_kernel")
);

/* Returns the MAAS config for enabling DNSSEC validation of upstream zones.
 * @param {Object} state - The redux state.
 * @returns {String} DNSSEC validation type.
 */
config.dnssecValidation = createSelector(
  [config.all],
  configs => getValueFromName(configs, "dnssec_validation")
);

/**
 * Returns the possible DNSSEC validation options reformatted as objects.
 * @param {Object} state - The redux state.
 * @returns {Array} DNSSEC validation options.
 */
config.dnssecOptions = createSelector(
  [config.all],
  configs => getOptionsFromName(configs, "dnssec_validation")
);

/**
 * Returns the MAAS config for the list of external networks that will be allowed to use MAAS for DNS resolution.
 * @param {Object} state - The redux state.
 * @returns {String} External networks.
 */
config.dnsTrustedAcl = createSelector(
  [config.all],
  configs => getValueFromName(configs, "dns_trusted_acl")
);

/**
 * Returns the MAAS config for upstream DNS.
 * @param {Object} state - The redux state.
 * @returns {String} Upstream DNS(s).
 */
config.upstreamDns = createSelector(
  [config.all],
  configs => getValueFromName(configs, "upstream_dns")
);

/**
 * Returns the MAAS config for NTP servers.
 * @param {Object} state - The redux state.
 * @returns {String} NTP server(s).
 */
config.ntpServers = createSelector(
  [config.all],
  configs => getValueFromName(configs, "ntp_servers")
);

/**
 * Returns the MAAS config for only enabling external NTP servers.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Enable external NTP servers only.
 */
config.ntpExternalOnly = createSelector(
  [config.all],
  configs => getValueFromName(configs, "ntp_external_only")
);

/**
 * Returns the MAAS config for remote syslog server to forward machine logs.
 * @param {Object} state - The redux state.
 * @returns {String} Remote syslog server.
 */
config.remoteSyslog = createSelector(
  [config.all],
  configs => getValueFromName(configs, "remote_syslog")
);

/**
 * Returns the MAAS config for enabling network discovery.
 * @param {Object} state - The redux state.
 * @returns {String} Enable network discovery.
 */
config.networkDiscovery = createSelector(
  [config.all],
  configs => getValueFromName(configs, "network_discovery")
);

/**
 * Returns the possible network discovery options reformatted as objects.
 * @param {Object} state - The redux state.
 * @returns {Array} Network discovery options.
 */
config.networkDiscoveryOptions = createSelector(
  [config.all],
  configs => getOptionsFromName(configs, "network_discovery")
);

/**
 * Returns the MAAS config for active discovery interval.
 * @param {Object} state - The redux state.
 * @returns {Number} Active discovery interval in ms.
 */
config.activeDiscoveryInterval = createSelector(
  [config.all],
  configs => getValueFromName(configs, "active_discovery_interval")
);

/**
 * Returns the possible active discovery intervals reformatted as objects.
 * @param {Object} state - The redux state.
 * @returns {Array} Active discovery intervals.
 */
config.discoveryIntervalOptions = createSelector(
  [config.all],
  configs => getOptionsFromName(configs, "active_discovery_interval")
);

/**
 * Returns the MAAS config for kernel parameters.
 * @param {object} state - The redux state.
 * @returns {String} Kernel parameters.
 */
config.kernelParams = createSelector(
  [config.all],
  configs => getValueFromName(configs, "kernel_opts")
);

export default config;
