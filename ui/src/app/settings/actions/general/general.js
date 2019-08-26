const general = {};

general.fetchOsInfo = () => {
  return {
    type: "FETCH_GENERAL_OSINFO",
    meta: {
      model: "general",
      method: "osinfo"
    }
  };
};

export default general;
