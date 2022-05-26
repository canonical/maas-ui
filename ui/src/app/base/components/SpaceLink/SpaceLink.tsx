import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";

import type { RootState } from "app/store/root/types";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import type { Space, SpaceMeta } from "app/store/space/types";
import { getSpaceDisplay } from "app/store/space/utils";
import subnetsURLs from "app/subnets/urls";

type Props = {
  id?: Space[SpaceMeta.PK] | null;
};

const SpaceLink = ({ id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const space = useSelector((state: RootState) =>
    spaceSelectors.getById(state, id)
  );
  const spacesLoading = useSelector(spaceSelectors.loading);
  const spaceDisplay = getSpaceDisplay(space);

  useEffect(() => {
    dispatch(spaceActions.fetch());
  }, [dispatch]);

  if (spacesLoading) {
    return <Spinner aria-label="Loading spaces" />;
  }
  if (!space) {
    return <>{spaceDisplay}</>;
  }
  return (
    <Link to={subnetsURLs.space.index({ id: space.id })}>{spaceDisplay}</Link>
  );
};

export default SpaceLink;
