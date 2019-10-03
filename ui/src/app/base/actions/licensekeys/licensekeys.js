const licenseKeys = {};

licenseKeys.fetch = () => ({
  type: "FETCH_LICENSE_KEYS"
});

licenseKeys.cleanup = () => ({
  type: "CLEANUP_LICENSE_KEYS"
});

export default licenseKeys;
