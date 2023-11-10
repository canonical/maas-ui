import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DhcpForm from "../DhcpForm";

import { useFetchActions } from "@/app/base/hooks";
import { useGetURLId } from "@/app/base/hooks/urls";
import { actions as dhcpsnippetActions } from "@/app/store/dhcpsnippet";
import dhcpsnippetSelectors from "@/app/store/dhcpsnippet/selectors";
import { DHCPSnippetMeta } from "@/app/store/dhcpsnippet/types";
import type { RootState } from "@/app/store/root/types";

export const DhcpEdit = (): JSX.Element => {
  const id = useGetURLId(DHCPSnippetMeta.PK);
  const loading = useSelector(dhcpsnippetSelectors.loading);
  const dhcpsnippet = useSelector((state: RootState) =>
    dhcpsnippetSelectors.getById(state, id)
  );

  useFetchActions([dhcpsnippetActions.fetch]);

  if (loading) {
    return <Spinner text="Loading..." />;
  }
  if (!dhcpsnippet) {
    return <h4>DHCP snippet not found</h4>;
  }
  return <DhcpForm dhcpSnippet={dhcpsnippet} />;
};

export default DhcpEdit;
