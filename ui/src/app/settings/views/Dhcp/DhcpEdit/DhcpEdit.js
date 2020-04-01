import { Loader } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { useParams } from "app/base/hooks";
import { dhcpsnippet as dhcpsnippetActions } from "app/base/actions";
import { dhcpsnippet as dhcpsnippetSelectors } from "app/base/selectors";
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
    return <Loader text="Loading..." />;
  }
  if (!dhcpsnippet) {
    return <h4>DHCP snippet not found</h4>;
  }
  return <DhcpForm dhcpSnippet={dhcpsnippet} />;
};

export default DhcpEdit;
