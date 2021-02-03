import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import DhcpForm from "../DhcpForm";

import { actions as dhcpsnippetActions } from "app/store/dhcpsnippet";
import dhcpsnippetSelectors from "app/store/dhcpsnippet/selectors";
import type { RootState } from "app/store/root/types";

export const DhcpEdit = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const loading = useSelector(dhcpsnippetSelectors.loading);
  const dhcpsnippet = useSelector((state: RootState) =>
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
