const licenseKeys = {};

licenseKeys.fetch = () => ({
  type: "FETCH_LICENSE_KEYS"
});

licenseKeys.delete = licenseKey => ({
  type: "DELETE_LICENSE_KEY",
  payload: licenseKey
});

licenseKeys.cleanup = () => ({
  type: "CLEANUP_LICENSE_KEYS"
});

export default licenseKeys;
