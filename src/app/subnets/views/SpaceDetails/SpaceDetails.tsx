import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import SpaceDetailsHeader from "./SpaceDetailsHeader";
import SpaceSubnets from "./SpaceSubnets";
import SpaceSummary from "./SpaceSummary";

import MainContentSection from "app/base/components/MainContentSection";
import ModelNotFound from "app/base/components/ModelNotFound";
import SectionHeader from "app/base/components/SectionHeader";
import { useGetURLId, useWindowTitle } from "app/base/hooks";
import type { RootState } from "app/store/root/types";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import { SpaceMeta } from "app/store/space/types";
import subnetURLs from "app/subnets/urls";
import { isId } from "app/utils";

const SpaceDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const id = useGetURLId(SpaceMeta.PK);
  const space = useSelector((state: RootState) =>
    spaceSelectors.getById(state, id)
  );
  const spacesLoading = useSelector(spaceSelectors.loading);
  const isValidID = isId(id);
  useWindowTitle(`${space?.name || "Space"} details`);

  useEffect(() => {
    if (isValidID) {
      dispatch(spaceActions.get(id));
      dispatch(spaceActions.setActive(id));
    }

    const unsetActiveSpaceAndCleanup = () => {
      dispatch(spaceActions.setActive(null));
      dispatch(spaceActions.cleanup());
    };
    return unsetActiveSpaceAndCleanup;
  }, [dispatch, id, isValidID]);

  if (!space) {
    const spaceNotFound = !isValidID || !spacesLoading;

    if (spaceNotFound) {
      return (
        <ModelNotFound
          id={id}
          linkURL={subnetURLs.indexWithParams({ by: "space" })}
          modelName="space"
        />
      );
    }
    return <MainContentSection header={<SectionHeader loading />} />;
  }

  return (
    <MainContentSection header={<SpaceDetailsHeader space={space} />}>
      <SpaceSummary space={space} />
      <SpaceSubnets space={space} />
    </MainContentSection>
  );
};

export default SpaceDetails;
