import type { ReactElement } from "react";
import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FabricDetailsHeader from "../../components/FabricDetailsHeader";
import FabricSummary from "../../components/FabricSummary";
import FabricVLANsTable from "../../components/FabricVLANsTable";

import ModelNotFound from "@/app/base/components/ModelNotFound";
import PageContent from "@/app/base/components/PageContent";
import { useGetURLId, useWindowTitle } from "@/app/base/hooks";
import { fabricActions } from "@/app/store/fabric";
import fabricSelectors from "@/app/store/fabric/selectors";
import { FabricMeta } from "@/app/store/fabric/types";
import type { RootState } from "@/app/store/root/types";
import { subnetActions } from "@/app/store/subnet";
import subnetURLs from "@/app/subnets/urls";
import { isId } from "@/app/utils";

const FabricDetails = (): ReactElement => {
  const dispatch = useDispatch();
  const id = useGetURLId(FabricMeta.PK);
  const fabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, id)
  );
  const fabricsLoading = useSelector(fabricSelectors.loading);
  const isValidID = isId(id);
  useWindowTitle(`${fabric?.name || "Fabric"} details`);

  useEffect(() => {
    if (isValidID) {
      dispatch(fabricActions.get(id));
      dispatch(fabricActions.setActive(id));
      dispatch(subnetActions.fetch());
    }

    return () => {
      dispatch(fabricActions.setActive(null));
      dispatch(fabricActions.cleanup());
    };
  }, [dispatch, id, isValidID]);

  if (!fabric) {
    const fabricNotFound = !isValidID || !fabricsLoading;

    if (fabricNotFound) {
      return (
        <ModelNotFound
          id={id}
          linkURL={subnetURLs.indexWithParams({ by: "fabric" })}
          modelName="fabric"
        />
      );
    }
  }

  return (
    <PageContent
      header={<FabricDetailsHeader fabric={fabric} />}
      sidePanelContent={undefined}
      sidePanelTitle={null}
      useNewSidePanelContext={true}
    >
      {!fabric ? (
        <Spinner text="Loading..." />
      ) : (
        <>
          <FabricSummary fabric={fabric} />
          <FabricVLANsTable fabric={fabric} />
        </>
      )}
    </PageContent>
  );
};

export default FabricDetails;
