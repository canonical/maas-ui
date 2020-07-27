import { Spinner } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { dhcpsnippet as dhcpsnippetActions } from "app/base/actions";
import dhcpsnippetSelectors from "app/store/dhcpsnippet/selectors";
import DhcpForm from "../DhcpForm";

export const DhcpEdit = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const loading = useSelector(dhcpsnippetSelectors.loading);
  const dhcpsnippet = useSelector((state) =>
    dhcpsnippetSelectors.getById(state, parseInt(id))
  );

  useEffect(() => {
    dispatch(dhcpsnippetActions.fetch());
  }, [dispatch]);

  if (loading) {
    return <Spinner text="Loading..." />;
  }
  if (!dhcpsnippet) {
    return <h4>DHCP snippet not found</h4>;
  }
  return <DhcpForm dhcpSnippet={dhcpsnippet} />;
};

export default DhcpEdit;
