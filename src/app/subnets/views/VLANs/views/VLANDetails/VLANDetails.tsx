import type { ReactElement } from "react";
import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ModelNotFound from "@/app/base/components/ModelNotFound";
import PageContent from "@/app/base/components/PageContent";
import { useFetchActions, useGetURLId, useWindowTitle } from "@/app/base/hooks";
import type { RootState } from "@/app/store/root/types";
import subnetSelectors from "@/app/store/subnet/selectors";
import { vlanActions } from "@/app/store/vlan";
import vlanSelectors from "@/app/store/vlan/selectors";
import { VLANMeta } from "@/app/store/vlan/types";
import subnetURLs from "@/app/subnets/urls";
import {
  DHCPStatus,
  VLANDetailsHeader,
  VLANSubnetsTable,
  VLANSummary,
} from "@/app/subnets/views/VLANs/components";
import DHCPSnippets from "@/app/subnets/views/VLANs/components/DHCPSnippets";
import ReservedRangesTable from "@/app/subnets/views/VLANs/components/ReservedRangesTable";
import { isId } from "@/app/utils";

const VLANDetails = (): ReactElement => {
  const dispatch = useDispatch();
  const id = useGetURLId(VLANMeta.PK);
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const vlansLoading = useSelector(vlanSelectors.loading);
  const subnets = useSelector((state: RootState) =>
    subnetSelectors.getByIds(state, vlan?.subnet_ids || null)
  );
  useWindowTitle(`${vlan?.name || "VLAN"} details`);

  useEffect(() => {
    if (isId(id)) {
      dispatch(vlanActions.get(id));
      dispatch(vlanActions.setActive(id));
    }

    return () => {
      dispatch(vlanActions.setActive(null));
      dispatch(vlanActions.cleanup());
    };
  }, [dispatch, id]);

  useFetchActions([vlanActions.fetch]);

  if (!vlan) {
    return (
      <ModelNotFound
        id={id}
        linkURL={subnetURLs.indexWithParams({ by: "fabric" })}
        modelName="VLAN"
      />
    );
  }

  return (
    <PageContent
      header={<VLANDetailsHeader vlan={vlan} />}
      sidePanelContent={undefined}
      sidePanelTitle={null}
      useNewSidePanelContext={true}
    >
      {vlansLoading ? (
        <Spinner text="Loading..." />
      ) : (
        <>
          <VLANSummary id={id} />
          <DHCPStatus id={id} />
          <ReservedRangesTable
            hasVLANSubnets={subnets.length > 0}
            vlanId={id}
          />
          <VLANSubnetsTable id={id} />
          <DHCPSnippets
            modelName={VLANMeta.MODEL}
            subnetIds={vlan.subnet_ids}
          />
        </>
      )}
    </PageContent>
  );
};

export default VLANDetails;
