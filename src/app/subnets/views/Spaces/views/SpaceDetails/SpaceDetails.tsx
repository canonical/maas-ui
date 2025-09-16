import type { ReactElement } from "react";
import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ModelNotFound from "@/app/base/components/ModelNotFound";
import PageContent from "@/app/base/components/PageContent/PageContent";
import { useGetURLId, useWindowTitle } from "@/app/base/hooks";
import type { RootState } from "@/app/store/root/types";
import { spaceActions } from "@/app/store/space";
import spaceSelectors from "@/app/store/space/selectors";
import { SpaceMeta } from "@/app/store/space/types";
import subnetURLs from "@/app/subnets/urls";
import {
  SpaceDetailsHeader,
  SpaceSubnetsTable,
  SpaceSummary,
} from "@/app/subnets/views/Spaces/components";
import { isId } from "@/app/utils";

const SpaceDetails = (): ReactElement => {
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

    return () => {
      dispatch(spaceActions.setActive(null));
      dispatch(spaceActions.cleanup());
    };
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
  }

  return (
    <PageContent
      header={<SpaceDetailsHeader space={space} />}
      sidePanelContent={undefined}
      sidePanelTitle={null}
      useNewSidePanelContext={true}
    >
      {!space ? (
        <Spinner text="Loading..." />
      ) : (
        <>
          <SpaceSummary space={space} />
          <SpaceSubnetsTable space={space} />
        </>
      )}
    </PageContent>
  );
};

export default SpaceDetails;
