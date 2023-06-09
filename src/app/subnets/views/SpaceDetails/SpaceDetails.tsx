import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import SpaceDetailsHeader from "./SpaceDetailsHeader";
import SpaceDelete from "./SpaceDetailsHeader/SpaceDelete";
import SpaceSubnets from "./SpaceSubnets";
import SpaceSummary from "./SpaceSummary";
import type { SpaceDetailsSidePanelContent } from "./constants";
import { SpaceDetailsViews } from "./constants";

import ModelNotFound from "app/base/components/ModelNotFound";
import PageContent from "app/base/components/PageContent/PageContent";
import SectionHeader from "app/base/components/SectionHeader";
import { useGetURLId, useWindowTitle } from "app/base/hooks";
import type { SidePanelContextType } from "app/base/side-panel-context";
import { useSidePanel } from "app/base/side-panel-context";
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
  const { sidePanelContent, setSidePanelContent } =
    useSidePanel() as SidePanelContextType<SpaceDetailsSidePanelContent>;

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
    return (
      <PageContent
        header={<SectionHeader loading />}
        sidePanelContent={null}
        sidePanelTitle={null}
      />
    );
  }

  let content = null;
  let title = null;

  if (
    sidePanelContent &&
    sidePanelContent.view === SpaceDetailsViews.DELETE_SPACE
  ) {
    content = (
      <SpaceDelete
        handleClose={() => setSidePanelContent(null)}
        space={space}
      />
    );
    title = "Delete space";
  }

  return (
    <PageContent
      header={
        <SpaceDetailsHeader
          setSidePanelContent={setSidePanelContent}
          sidePanelContent={sidePanelContent}
          space={space}
        />
      }
      sidePanelContent={content}
      sidePanelTitle={title}
    >
      <SpaceSummary space={space} />
      <SpaceSubnets space={space} />
    </PageContent>
  );
};

export default SpaceDetails;
