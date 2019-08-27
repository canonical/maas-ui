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

export default dhcpsnippet;
