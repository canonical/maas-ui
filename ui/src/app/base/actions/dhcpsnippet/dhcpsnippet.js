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

dhcpsnippet.create = params => {
  return {
    type: "CREATE_DHCPSNIPPET",
    meta: {
      model: "dhcpsnippet",
      method: "create"
    },
    payload: {
      params
    }
  };
};

dhcpsnippet.update = params => {
  return {
    type: "UPDATE_DHCPSNIPPET",
    meta: {
      model: "dhcpsnippet",
      method: "update"
    },
    payload: {
      params
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
