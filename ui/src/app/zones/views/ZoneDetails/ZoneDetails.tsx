import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import ZoneDetailsContent from "./ZoneDetailsContent";
import ZoneDetailsForm from "./ZoneDetailsForm";
import ZoneDetailsHeader from "./ZoneDetailsHeader";

import EditableSection from "app/base/components/EditableSection";
import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import authSelectors from "app/store/auth/selectors";
import type { RootState } from "app/store/root/types";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import { ZoneMeta } from "app/store/zone/types";
import { isId } from "app/utils";
import zoneURLs from "app/zones/urls";

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
      <ModelNotFound id={zoneID} linkURL={zoneURLs.index} modelName="zone" />
    );
  }

  return (
    <Section header={<ZoneDetailsHeader id={zoneID} />}>
      <EditableSection
        canEdit={isAdmin}
        className="u-no-padding--top"
        hasSidebarTitle
        renderContent={(editing, setEditing) =>
          editing ? (
            <ZoneDetailsForm id={zoneID} closeForm={() => setEditing(false)} />
          ) : (
            <ZoneDetailsContent id={zoneID} />
          )
        }
        title="Zone summary"
      />
    </Section>
  );
};

export default ZoneDetails;
