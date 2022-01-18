import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import FabricDetailsHeader from "./FabricDetailsHeader";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { useGetURLId } from "app/base/hooks/urls";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { FabricMeta } from "app/store/fabric/types";
import type { RootState } from "app/store/root/types";
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

  useEffect(() => {
    if (isValidID) {
      dispatch(fabricActions.get(id));
      dispatch(fabricActions.setActive(id));
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
        <ModelNotFound id={id} linkURL={subnetURLs.index} modelName="fabric" />
      );
    }
    return <Section header={<SectionHeader loading />} />;
  }

  return <Section header={<FabricDetailsHeader fabric={fabric} />} />;
};

export default FabricDetails;
