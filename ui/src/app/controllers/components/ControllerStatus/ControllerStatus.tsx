import { useEffect } from "react";

import { Icon, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import controllerSelectors from "app/store/controller/selectors";
import type { Controller, ControllerMeta } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";
import { actions as serviceActions } from "app/store/service";
import type { Service } from "app/store/service/types";

type Props = {
  systemId: Controller[ControllerMeta.PK];
};

const countStatus = (services: Service[], status: Service["status"]) =>
  services.filter((service) => service.status === status).length;

export const ControllerStatus = ({ systemId }: Props): JSX.Element | null => {
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  );
  const dispatch = useDispatch();
  const services = useSelector((state: RootState) =>
    controllerSelectors.servicesForController(state, controller?.system_id)
  );

  useEffect(() => {
    dispatch(serviceActions.fetch());
  }, [dispatch]);

  if (!controller || !services?.length) {
    return null;
  }
  let icon: string | null = null;
  let message: string | null = null;
  const dead = countStatus(services, "dead");
  const degraded = countStatus(services, "degraded");
  const success = countStatus(services, "success");
  if (dead) {
    icon = "power-error";
    message = `${dead} dead`;
  } else if (degraded) {
    icon = "warning";
    message = `${degraded} degraded`;
  } else {
    icon = "success";
    message = `${success} running`;
  }
  return (
    <Tooltip message={message}>
      <Icon name={icon} />
    </Tooltip>
  );
};

export default ControllerStatus;
