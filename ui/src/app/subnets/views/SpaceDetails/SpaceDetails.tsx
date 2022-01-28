import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import SpaceDetailsHeader from "./SpaceDetailsHeader";
import SpaceSubnets from "./SpaceSubnets";
import SpaceSummary from "./SpaceSummary";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
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
          linkURL={subnetURLs.index({ by: "space" })}
          modelName="space"
        />
      );
    }
    return <Section header={<SectionHeader loading />} />;
  }

  return (
    <Section header={<SpaceDetailsHeader space={space} />}>
      <SpaceSummary name={space.name} description={space.description} />
      <SpaceSubnets />
    </Section>
  );
};

export default SpaceDetails;
