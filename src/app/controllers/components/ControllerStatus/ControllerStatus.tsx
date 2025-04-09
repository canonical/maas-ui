import { Icon } from "@canonical/react-components";
import { useSelector } from "react-redux";

import TooltipButton from "@/app/base/components/TooltipButton";
import { useFetchActions } from "@/app/base/hooks";
import controllerSelectors from "@/app/store/controller/selectors";
import type { Controller, ControllerMeta } from "@/app/store/controller/types";
import type { RootState } from "@/app/store/root/types";
import { serviceActions } from "@/app/store/service";
import { ServiceStatus } from "@/app/store/service/types";
import type { Service } from "@/app/store/service/types";

type Props = {
  systemId: Controller[ControllerMeta.PK];
};

const countStatus = (services: Service[], status: ServiceStatus) =>
  services.filter((service) => service.status === status).length;

export const ControllerStatus = ({
  systemId,
}: Props): React.ReactElement | null => {
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  );

  const services = useSelector((state: RootState) =>
    controllerSelectors.servicesForController(state, controller?.system_id)
  );

  useFetchActions([serviceActions.fetch]);

  if (!controller || !services?.length) {
    return null;
  }
  let icon: string | null;
  let message: string | null = null;
  const dead = countStatus(services, ServiceStatus.DEAD);
  const degraded = countStatus(services, ServiceStatus.DEGRADED);
  const running = countStatus(services, ServiceStatus.RUNNING);
  const off = countStatus(services, ServiceStatus.OFF);
  if (dead) {
    icon = "power-error";
    message = `${dead} dead`;
  } else if (degraded) {
    icon = "warning";
    message = `${degraded} degraded`;
  } else if (running) {
    icon = "success";
    message = `${running} running`;
  } else if (off) {
    icon = "power-off";
    message = `${off} off`;
  } else {
    icon = "power-unknown";
  }

  if (message) {
    return (
      <TooltipButton
        iconName={icon}
        iconProps={{ "data-testid": "controller-status-icon" }}
        message={message}
      />
    );
  }
  return <Icon data-testid="controller-status-icon" name={icon} />;
};

export default ControllerStatus;
