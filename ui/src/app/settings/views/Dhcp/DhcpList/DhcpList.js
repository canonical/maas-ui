import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import actions from "app/settings/actions";
import Loader from "app/base/components/Loader";
import selectors from "app/settings/selectors";

// Temporarily create a item component, this will be replaced with a table.
const DhcpListItem = ({ id, name, subnet }) => {
  const subnetItem = useSelector(state =>
    selectors.subnet.getById(state, subnet)
  );
  return (
    <li>
      {name} {subnet && `(subnet: ${subnetItem.name})`}
    </li>
  );
};

const DhcpList = () => {
  const dhcpsnippetLoading = useSelector(selectors.dhcpsnippet.loading);
  const dhcpsnippetLoaded = useSelector(selectors.dhcpsnippet.loaded);
  const dhcpsnippets = useSelector(selectors.dhcpsnippet.all);
  const subnetLoading = useSelector(selectors.subnet.loading);
  const subnetLoaded = useSelector(selectors.subnet.loaded);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.dhcpsnippet.fetch());
    dispatch(actions.subnet.fetch());
  }, [dispatch]);

  if (dhcpsnippetLoading || subnetLoading) {
    return <Loader text="Loading..." />;
  }
  const snippets = dhcpsnippets.map(dhcpsnippet => (
    <DhcpListItem {...dhcpsnippet} key={dhcpsnippet.id} />
  ));
  return dhcpsnippetLoaded && subnetLoaded && <ul>{snippets}</ul>;
};

export default DhcpList;
