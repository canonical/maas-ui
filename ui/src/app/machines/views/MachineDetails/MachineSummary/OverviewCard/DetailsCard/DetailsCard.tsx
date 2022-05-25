import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { extractPowerType } from "@maas-ui/maas-ui-shared";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";

import { useCanEdit, useSendAnalytics } from "app/base/hooks";
import kvmURLs from "app/kvm/urls";
import { actions as generalActions } from "app/store/general";
import { PowerTypeNames } from "app/store/general/constants";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import type { MachineDetails } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import { getTagsDisplay } from "app/store/tag/utils";

type Props = {
  machine: MachineDetails;
};

const DetailsCard = ({ machine }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const powerTypes = useSelector(powerTypesSelectors.get);
  const tagsLoaded = useSelector(tagSelectors.loaded);
  const machineTags = useSelector((state: RootState) =>
    tagSelectors.getByIDs(state, machine.tags)
  );
  const sendAnalytics = useSendAnalytics();
  const canEdit = useCanEdit(machine, true);

  const configTabUrl = `/machine/${machine.system_id}/configuration`;
  const powerTypeDescription = powerTypes.find(
    (powerType) => powerType.name === machine.power_type
  )?.description;
  const powerTypeDisplay = extractPowerType(
    powerTypeDescription || "",
    machine.power_type
  );
  const tagsDisplay = getTagsDisplay(machineTags);

  useEffect(() => {
    dispatch(generalActions.fetchPowerTypes());
  }, [dispatch]);

  return (
    <div className="overview-card__details">
      <div>
        <div className="u-text--muted">Owner</div>
        <span title={machine.owner || "-"} data-testid="owner">
          {machine.owner || "-"}
        </span>
      </div>
      <div>
        <div className="u-text--muted">Domain</div>
        <span title={machine.domain?.name} data-testid="domain">
          {machine.domain?.name}
        </span>
      </div>
      <div>
        <div className="u-text--muted">Host</div>
        <span data-testid="host">
          {machine.pod ? (
            <Link
              to={
                machine.power_type === PowerTypeNames.LXD
                  ? kvmURLs.lxd.single.index({ id: machine.pod.id })
                  : kvmURLs.virsh.details.index({ id: machine.pod.id })
              }
            >
              {machine.pod.name} ›
            </Link>
          ) : (
            <em>None</em>
          )}
        </span>
      </div>
      <div data-testid="zone">
        <div>
          {canEdit ? (
            <Link
              onClick={() =>
                sendAnalytics(
                  "Machine details",
                  "Zone configuration link",
                  "Machine summary tab"
                )
              }
              to={configTabUrl}
            >
              Zone ›
            </Link>
          ) : (
            <span className="u-text--muted">Zone</span>
          )}
        </div>
        <span title={machine.zone.name}>{machine.zone.name}</span>
      </div>
      <div data-testid="resource-pool">
        <div>
          {canEdit ? (
            <Link
              onClick={() =>
                sendAnalytics(
                  "Machine details",
                  "Resource pool configuration link",
                  "Machine summary tab"
                )
              }
              to={configTabUrl}
            >
              Resource pool ›
            </Link>
          ) : (
            <span className="u-text--muted">Resource pool</span>
          )}
        </div>
        <span title={machine.pool.name}>{machine.pool.name}</span>
      </div>
      <div>
        <div>
          {canEdit ? (
            <Link
              onClick={() =>
                sendAnalytics(
                  "Machine details",
                  "Power type configuration link",
                  "Machine summary tab"
                )
              }
              to={configTabUrl}
            >
              Power type ›
            </Link>
          ) : (
            <span className="u-text--muted">Power type</span>
          )}
        </div>
        <span title={machine.power_type} data-testid="power-type">
          {powerTypeDisplay || machine.power_type || <em>None</em>}
        </span>
      </div>
      <div className="u-break-word">
        <div>
          {canEdit ? (
            <Link
              onClick={() =>
                sendAnalytics(
                  "Machine details",
                  "Tags configuration link",
                  "Machine summary tab"
                )
              }
              to={configTabUrl}
            >
              Tags ›
            </Link>
          ) : (
            <span className="u-text--muted">Tags</span>
          )}
        </div>
        {tagsLoaded ? (
          <span data-testid="machine-tags" title={tagsDisplay}>
            {tagsDisplay}
          </span>
        ) : (
          <Spinner data-testid="loading-tags" />
        )}
      </div>
    </div>
  );
};

export default DetailsCard;
