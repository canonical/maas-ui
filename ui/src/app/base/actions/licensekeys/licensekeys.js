const licenseKeys = {};

licenseKeys.create = params => {
  return {
    type: "CREATE_LICENSE_KEY",
    payload: params
  };
};

licenseKeys.delete = licenseKey => ({
  type: "DELETE_LICENSE_KEY",
  payload: licenseKey
});

licenseKeys.fetch = () => ({
  type: "FETCH_LICENSE_KEYS"
});

licenseKeys.cleanup = () => ({
  type: "CLEANUP_LICENSE_KEYS"
});

export default licenseKeys;
