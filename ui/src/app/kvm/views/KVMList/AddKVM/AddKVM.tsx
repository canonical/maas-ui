import { useEffect, useState } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import AddLxd from "./AddLxd";
import AddVirsh from "./AddVirsh";

import { useWindowTitle } from "app/base/hooks";
import { actions as generalActions } from "app/store/general";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/types";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

export type SetKvmType = (kvmType: PodType) => void;

export const AddKvmTypeSelect = (): JSX.Element => {
  const dispatch = useDispatch();
  const powerTypesLoaded = useSelector(powerTypesSelectors.loaded);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const allLoaded = powerTypesLoaded && resourcePoolsLoaded && zonesLoaded;

  const [kvmType, setKvmType] = useState<PodType>(PodType.LXD);

  useEffect(() => {
    dispatch(generalActions.fetchPowerTypes());
    dispatch(podActions.fetch());
    dispatch(resourcePoolActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  useWindowTitle("Add KVM");

  if (!allLoaded) {
    return <Spinner className="u-no-margin u-no-padding" text="Loading" />;
  }
  return (
    <>
      {kvmType === PodType.LXD && <AddLxd setKvmType={setKvmType} />}
      {kvmType === PodType.VIRSH && <AddVirsh setKvmType={setKvmType} />}
    </>
  );
};

export default AddKvmTypeSelect;
