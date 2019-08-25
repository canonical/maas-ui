const general = {};

/**
 * Returns object with osinfo data
 * @param {Object} state - the redux state
 * @returns {Object} The osinfo data
 */
general.osinfo = state => state.general.osInfo;

/**
 * Returns true if general is loading
 * @param {Object} state - the redux state
 * @returns {Boolean} - general is loading
 */
general.loading = state => state.general.loading;

/**
 * Returns true if general is loaded
 * @param {Object} state - the redux state
 * @returns {Boolean} - general is loading
 */
general.loaded = state => state.general.loaded;

/**
 * Returns kernels data
 * @param {Object} state - the redux state
 * @param {String} os - the OS to get kernel options for
 * @returns {Array} - the available kernel options
 */
general.getUbuntuKernelOptions = (state, os) => {
  let kernelOptions = [];

  if (state.general.osInfo.kernels && state.general.osInfo.kernels.ubuntu) {
    kernelOptions = state.general.osInfo.kernels.ubuntu[os];
  }

  kernelOptions = [["", "No minimum kernel"]].concat(kernelOptions);

  return kernelOptions.map(option => ({
    value: option[0],
    label: option[1]
  }));
};

/**
 * Returns all ubuntu kernel options
 * @param {Object} state - the redux state
 * @returns {Object} - all ubuntu kernel options
 */
general.getAllUbuntuKernelOptions = state => {
  let allUbuntuKernelOptions = {};

  if (state.general.osInfo.kernels && state.general.osInfo.kernels.ubuntu) {
    Object.keys(state.general.osInfo.kernels.ubuntu).forEach(key => {
      allUbuntuKernelOptions[key] = general.getUbuntuKernelOptions(state, key);
    });
  }

  return allUbuntuKernelOptions;
};

/**
 * Returns OS releases
 * @param {Object} state - the redux state
 * @param {String} os - the OS to get releases of
 * @returns {Array} - the available OS releases
 */
general.getOsReleases = (state, os) => {
  let osReleases = [];

  if (state.general.osInfo.releases) {
    osReleases = state.general.osInfo.releases
      .filter(release => release[0].includes(os))
      .map(release => ({
        value: release[0].split("/")[1],
        label: release[1]
      }));
  }

  return osReleases;
};

/**
 * Returns an object with all OS releases
 * @param {Object} state - the redux state
 * @returns {Object} - all OS releases
 */
general.getAllOsReleases = state => {
  const allOsReleases = {};

  if (
    state.general.osInfo &&
    state.general.osInfo.osystems &&
    state.general.osInfo.releases
  ) {
    state.general.osInfo.osystems.forEach(osystem => {
      const os = osystem[0];
      allOsReleases[os] = general.getOsReleases(state, os);
    });
  }

  return allOsReleases;
};

export default general;
