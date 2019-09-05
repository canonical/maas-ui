const dhcpsnippet = {};

dhcpsnippet.fetch = () => {
  return {
    type: "FETCH_DHCPSNIPPET",
    meta: {
      model: "dhcpsnippet",
      method: "list"
    }
  };
};

dhcpsnippet.delete = id => {
  return {
    type: "DELETE_DHCPSNIPPET",
    meta: {
      model: "dhcpsnippet",
      method: "delete"
    },
    payload: {
      params: {
        id
      }
    }
  };
};

dhcpsnippet.cleanup = () => {
  return {
    type: "CLEANUP_DHCPSNIPPET"
  };
};

export default dhcpsnippet;
