import { useEffect, useState } from "react";

import { Button } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import DeleteConfirm from "./DeleteConfirm";

import SectionHeader from "@/app/base/components/SectionHeader";
import { useFetchActions } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import authSelectors from "@/app/store/auth/selectors";
import type { RootState } from "@/app/store/root/types";
import { zoneActions } from "@/app/store/zone";
import { ZONE_ACTIONS } from "@/app/store/zone/constants";
import zoneSelectors from "@/app/store/zone/selectors";

type Props = {
  id: number;
};

const ZoneDetailsHeader = ({ id }: Props): JSX.Element => {
  const [showConfirm, setShowConfirm] = useState(false);
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const deleteStatus = useSelector((state: RootState) =>
    zoneSelectors.getModelActionStatus(state, ZONE_ACTIONS.delete, id)
  );
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, Number(id))
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useFetchActions([zoneActions.fetch]);

  useEffect(() => {
    if (deleteStatus === "success") {
      dispatch(zoneActions.cleanup([ZONE_ACTIONS.delete]));
      navigate({ pathname: urls.zones.index });
    }
  }, [dispatch, deleteStatus, navigate]);

  const isAdmin = useSelector(authSelectors.isAdmin);
  const isDefaultZone = id === 1;

  const deleteZone = () => {
    if (isAdmin && !isDefaultZone) {
      dispatch(zoneActions.delete({ id }));
    }
  };

  const closeExpanded = () => setShowConfirm(false);

  let buttons: JSX.Element[] | null = [
    <Button
      data-testid="delete-zone"
      key="delete-zone"
      onClick={() => setShowConfirm(true)}
    >
      Delete AZ
    </Button>,
  ];

  if (showConfirm || isDefaultZone || !isAdmin) {
    buttons = null;
  }

  let title = "";

  let confirmDelete = null;

  if (showConfirm && isAdmin && !isDefaultZone) {
    confirmDelete = (
      <>
        <hr />
        <DeleteConfirm
          closeExpanded={closeExpanded}
          confirmLabel="Delete AZ"
          deleting={deleteStatus === "loading"}
          message="Are you sure you want to delete this AZ?"
          onConfirm={deleteZone}
        />
      </>
    );
  }

  if (zonesLoaded && zone) {
    title = `Availability zone: ${zone.name}`;
  } else if (zonesLoaded) {
    title = "Availability zone not found";
    buttons = null;
  }

  return (
    <>
      <SectionHeader buttons={buttons} loading={!zonesLoaded} title={title} />

      {confirmDelete}
    </>
  );
};

export default ZoneDetailsHeader;
