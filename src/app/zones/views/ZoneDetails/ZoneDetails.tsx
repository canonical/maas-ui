import { useSelector } from "react-redux";

import ZoneDetailsContent from "./ZoneDetailsContent";
import ZoneDetailsForm from "./ZoneDetailsForm";
import ZoneDetailsHeader from "./ZoneDetailsHeader";

import { useGetZone } from "@/app/api/query/zones";
import EditableSection from "@/app/base/components/EditableSection";
import ModelNotFound from "@/app/base/components/ModelNotFound";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { useGetURLId } from "@/app/base/hooks/urls";
import urls from "@/app/base/urls";
import authSelectors from "@/app/store/auth/selectors";
import { ZoneMeta } from "@/app/store/zone/types";
import { isId } from "@/app/utils";

const ZoneDetails = (): JSX.Element => {
  const zoneID = useGetURLId(ZoneMeta.PK);
  const isAdmin = useSelector(authSelectors.isAdmin);
  const zone = useGetZone({ path: { zone_id: zoneID! } });

  useWindowTitle(zone?.data?.name ?? "Loading...");

  if (!isId(zoneID) || (!zone.isPending && !zone.data)) {
    return (
      <ModelNotFound id={zoneID} linkURL={urls.zones.index} modelName="zone" />
    );
  }

  return (
    <PageContent
      header={<ZoneDetailsHeader id={zoneID} />}
      sidePanelContent={null}
      sidePanelTitle={null}
    >
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
    </PageContent>
  );
};

export default ZoneDetails;
