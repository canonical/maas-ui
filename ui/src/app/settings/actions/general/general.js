import MESSAGE_TYPES from "app/base/constants";

const general = {};

general.fetchOsInfo = () => {
  return {
    type: "FETCH_GENERAL_OSINFO",
    meta: {
      model: "general",
      method: "osinfo",
      type: MESSAGE_TYPES.REQUEST
    }
  };
};

export default general;
