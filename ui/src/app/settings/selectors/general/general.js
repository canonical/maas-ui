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
 * @returns {Array} the available kernel options
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

export default general;
