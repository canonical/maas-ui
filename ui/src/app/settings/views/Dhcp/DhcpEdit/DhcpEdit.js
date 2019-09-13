import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { useParams } from "app/base/hooks";
import actions from "app/settings/actions";
import Loader from "app/base/components/Loader";
import selectors from "app/settings/selectors";
import DhcpForm from "../DhcpForm";

export const DhcpEdit = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const loading = useSelector(selectors.dhcpsnippet.loading);
  const dhcpsnippet = useSelector(state =>
    selectors.dhcpsnippet.getById(state, parseInt(id))
  );

  useEffect(() => {
    dispatch(actions.dhcpsnippet.fetch());
  }, [dispatch]);

  if (loading) {
    return <Loader text="Loading..." />;
  }
  if (!dhcpsnippet) {
    return <h4>DHCP snippet not found</h4>;
  }
  return <DhcpForm dhcpSnippet={dhcpsnippet} />;
};

export default DhcpEdit;
