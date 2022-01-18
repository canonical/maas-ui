import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import SubnetDetailsHeader from "./SubnetDetailsHeader";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { useGetURLId } from "app/base/hooks/urls";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import { SubnetMeta } from "app/store/subnet/types";
import subnetURLs from "app/subnets/urls";
import { isId } from "app/utils";

const SubnetDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const id = useGetURLId(SubnetMeta.PK);
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, id)
  );
  const subnetsLoading = useSelector(subnetSelectors.loading);
  const isValidID = isId(id);

  useEffect(() => {
    if (isValidID) {
      dispatch(subnetActions.get(id));
      dispatch(subnetActions.setActive(id));
    }

    const unsetActiveSubnetAndCleanup = () => {
      dispatch(subnetActions.setActive(null));
      dispatch(subnetActions.cleanup());
    };
    return unsetActiveSubnetAndCleanup;
  }, [dispatch, id, isValidID]);

  if (!subnet) {
    const subnetNotFound = !isValidID || !subnetsLoading;

    if (subnetNotFound) {
      return (
        <ModelNotFound id={id} linkURL={subnetURLs.index} modelName="subnet" />
      );
    }
    return <Section header={<SectionHeader loading />} />;
  }

  return <Section header={<SubnetDetailsHeader subnet={subnet} />} />;
};

export default SubnetDetails;
