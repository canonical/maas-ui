import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import LegacyLink from "app/base/components/LegacyLink";
import controllerURLs from "app/controllers/urls";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller, ControllerMeta } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId?: Controller[ControllerMeta.PK] | null;
};

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
    // TODO: Put aria-label directly on Spinner component when issue is fixed.
    // https://github.com/canonical-web-and-design/react-components/issues/651
    return (
      <span aria-label="Loading controllers">
        <Spinner />
      </span>
    );
  }
  if (!controller) {
    return null;
  }
  return (
    <LegacyLink
      route={controllerURLs.controller.index({ id: controller.system_id })}
    >
      <strong>{controller.hostname}</strong>
      <span>.{controller.domain.name}</span>
    </LegacyLink>
  );
};

export default ControllerLink;
