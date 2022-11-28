import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import FabricDetailsHeader from "./FabricDetailsHeader";
import FabricSummary from "./FabricSummary";
import FabricVLANs from "./FabricVLANs";

import MainContentSection from "app/base/components/MainContentSection";
import ModelNotFound from "app/base/components/ModelNotFound";
import SectionHeader from "app/base/components/SectionHeader";
import { useGetURLId, useWindowTitle } from "app/base/hooks";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { FabricMeta } from "app/store/fabric/types";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetURLs from "app/subnets/urls";
import { isId } from "app/utils";

const FabricDetails = (): JSX.Element => {
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

    const unsetActiveFabricAndCleanup = () => {
      dispatch(fabricActions.setActive(null));
      dispatch(fabricActions.cleanup());
    };
    return unsetActiveFabricAndCleanup;
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
    return <MainContentSection header={<SectionHeader loading />} />;
  }

  return (
    <MainContentSection header={<FabricDetailsHeader fabric={fabric} />}>
      <FabricSummary fabric={fabric} />
      <FabricVLANs fabric={fabric} />
    </MainContentSection>
  );
};

export default FabricDetails;
