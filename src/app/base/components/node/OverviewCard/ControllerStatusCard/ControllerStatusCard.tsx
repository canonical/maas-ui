import TooltipButton from "@/app/base/components/TooltipButton";
import type {
  ControllerVersions,
  ControllerDetails,
} from "@/app/store/controller/types";
import { useFormattedOS } from "@/app/store/machine/utils";

type Props = {
  controller: ControllerDetails;
};

export enum Labels {
  CheckingImages = "Checking images...",
  ImagesSynced = "Images synced",
  ImageSyncStatus = "Image sync status",
  NoStatus = "Asking for status...",
  Origin = "Origin",
  OSInfo = "OS info",
  RackTitle = "rackd",
  RegionRackTitle = "regiond + rackd",
  RegionTitle = "regiond",
  UnknownTitle = "Unknown node type",
  Version = "Version",
  VersionDetails = "Version details",
}

const getVersionDisplay = (versions: ControllerVersions) => {
  const { current, origin } = versions;
  return (
    <>
      <span aria-label={Labels.Version}>
        Version: {current.version || "Unknown (less than 2.3.0)"}
      </span>
      <br />
      <span aria-label={Labels.Origin}>Channel: {origin || "Unknown"}</span>
    </>
  );
};

const ControllerStatusCard = ({ controller }: Props): React.ReactElement => {
  const formattedOS = useFormattedOS(controller);

  return (
    <>
      <div className="overview-card__status" data-testid="controller-status">
        <strong className="p-muted-heading u-no-padding--top">Overview</strong>
        <h4 className="u-no-margin--bottom">
          {controller.node_type_display}&nbsp;
          {controller.versions && (
            <TooltipButton
              aria-label={Labels.VersionDetails}
              message={getVersionDisplay(controller.versions)}
            />
          )}
        </h4>
        <p aria-label={Labels.OSInfo} className="u-text--muted">
          {formattedOS}
        </p>
      </div>
      <div className="overview-card__test-warning" />
    </>
  );
};

export default ControllerStatusCard;
