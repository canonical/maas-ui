import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import ZoneDetailsContent from "./ZoneDetailsContent";
import ZoneDetailsForm from "./ZoneDetailsForm";
import ZoneDetailsHeader from "./ZoneDetailsHeader";

import EditableSection from "app/base/components/EditableSection";
import MainContentSection from "app/base/components/MainContentSection";
import ModelNotFound from "app/base/components/ModelNotFound";
import { useWindowTitle } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import urls from "app/base/urls";
import authSelectors from "app/store/auth/selectors";
import type { RootState } from "app/store/root/types";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import { ZoneMeta } from "app/store/zone/types";
import { isId } from "app/utils";

const ZoneDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const zoneID = useGetURLId(ZoneMeta.PK);
  const isAdmin = useSelector(authSelectors.isAdmin);
  const zonesLoading = useSelector(zoneSelectors.loading);
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, zoneID)
  );
  useWindowTitle(zone?.name ?? "Loading...");

  useEffect(() => {
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  if (!isId(zoneID) || (!zonesLoading && !zone)) {
    return (
      <ModelNotFound id={zoneID} linkURL={urls.zones.index} modelName="zone" />
    );
  }

  return (
    <MainContentSection header={<ZoneDetailsHeader id={zoneID} />}>
      <EditableSection
        canEdit={isAdmin}
        className="u-no-padding--top"
        hasSidebarTitle
        renderContent={(editing, setEditing) =>
          editing ? (
            <ZoneDetailsForm closeForm={() => setEditing(false)} id={zoneID} />
          ) : (
            <ZoneDetailsContent id={zoneID} />
          )
        }
        title="Zone summary"
      />
    </MainContentSection>
  );
};

export default ZoneDetails;
