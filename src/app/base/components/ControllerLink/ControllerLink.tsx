import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";

import urls from "app/base/urls";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller, ControllerMeta } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId?: Controller[ControllerMeta.PK] | null;
};

export enum Labels {
  LoadingControllers = "Loading controllers",
}

const ControllerLink = ({ systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  );
  const controllersLoading = useSelector(controllerSelectors.loading);

  useEffect(() => {
    dispatch(controllerActions.fetch());
  }, [dispatch]);

  if (controllersLoading) {
    return <Spinner aria-label={Labels.LoadingControllers} />;
  }
  if (!controller) {
    return null;
  }
  return (
    <Link to={urls.controllers.controller.index({ id: controller.system_id })}>
      <strong>{controller.hostname}</strong>
      <span>.{controller.domain.name}</span>
    </Link>
  );
};

export default ControllerLink;
