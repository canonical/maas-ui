import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useCanEdit, useIsRackControllerConnected } from "app/base/hooks";
import imagesURLs from "app/images/urls";
import machineURLs from "app/machines/urls";
import MachineNotifications from "app/machines/views/MachineDetails/MachineNotifications";
import { actions as generalActions } from "app/store/general";
import { architectures as architecturesSelectors } from "app/store/general/selectors";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import {
  isMachineDetails,
  useHasInvalidArchitecture,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { PowerState } from "app/store/types/enum";
import type { NodeEvent } from "app/store/types/node";

type Props = {
  id: Machine["system_id"];
};

const formatEventText = (event: NodeEvent) => {
  if (!event) {
    return "";
  }
  const text = [];
  if (event.type?.description) {
    text.push(event.type.description);
  }
  if (event.description) {
    text.push(event.description);
  }
  return text.join(" - ");
};

const SummaryNotifications = ({ id }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const architectures = useSelector(architecturesSelectors.get);
  const architecturesLoaded = useSelector(architecturesSelectors.loaded);
  const hasUsableArchitectures = architectures.length > 0;
  const canEdit = useCanEdit(machine, true);
  const isRackControllerConnected = useIsRackControllerConnected();
  const hasInvalidArchitecture = useHasInvalidArchitecture(machine);

  useEffect(() => {
    dispatch(generalActions.fetchArchitectures());
  }, [dispatch]);

  // Confirm that the full machine details have been fetched. This also allows
  // TypeScript know we're using the right union type (otherwise it will
  // complain that events don't exist on the base machine type).
  if (!isMachineDetails(machine) || !architecturesLoaded) {
    return null;
  }

  return (
    <MachineNotifications
      notifications={[
        {
          active:
            machine.power_state === PowerState.ERROR &&
            machine.events?.length > 0,
          content: (
            <>
              {formatEventText(machine.events[0])}.{" "}
              <Link
                to={machineURLs.machine.logs.index({ id: machine.system_id })}
                className="p-notification__action"
              >
                See logs
              </Link>
            </>
          ),
          severity: "negative",
          title: "Error:",
        },
        {
          active: canEdit && !isRackControllerConnected,
          content:
            "Editing is currently disabled because no rack controller is currently connected to the region.",
          severity: "negative",
          title: "Error:",
        },
        {
          active:
            canEdit &&
            hasInvalidArchitecture &&
            isRackControllerConnected &&
            hasUsableArchitectures,
          content:
            "This machine currently has an invalid architecture. Update the architecture of this machine to make it deployable.",
          severity: "negative",
          title: "Error:",
        },
        {
          active:
            canEdit &&
            hasInvalidArchitecture &&
            isRackControllerConnected &&
            !hasUsableArchitectures,
          content: (
            <>
              No boot images have been imported for a valid architecture to be
              selected. Visit the <Link to={imagesURLs.index}>images page</Link>{" "}
              to start the import process.
            </>
          ),
          severity: "negative",
          title: "Error:",
        },
        {
          active: machine.cpu_count === 0,
          content:
            "Commission this machine to get CPU, Memory and Storage information.",
        },
      ]}
    />
  );
};

export default SummaryNotifications;
