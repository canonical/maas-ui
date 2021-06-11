import { useEffect, useState } from "react";

import { Button } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import DeleteConfirm from "./DeleteConfirm";

import SectionHeader from "app/base/components/SectionHeader";
import type { RootState } from "app/store/root/types";
import { actions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import zonesURLs from "app/zones/urls";

type Props = {
  id: number;
};

const ZoneDetailsHeader = ({ id }: Props): JSX.Element => {
  const [showConfirm, setShowConfirm] = useState(false);
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, Number(id))
  );
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  const deleteZone = () => {
    dispatch(actions.delete(id));
    history.push({ pathname: zonesURLs.index });
  };

  const closeExpanded = () => setShowConfirm(false);

  let buttons: JSX.Element[] | null = [
    <Button
      appearance="neutral"
      data-test="delete-zone"
      key="delete-zone"
      onClick={() => setShowConfirm(true)}
    >
      Delete AZ
    </Button>,
  ];

  let title = "";

  let confirmDelete = null;

  if (showConfirm) {
    confirmDelete = (
      <>
        <hr />
        <DeleteConfirm
          confirmLabel="Delete AZ"
          onConfirm={deleteZone}
          closeExpanded={closeExpanded}
          message="Are you sure you want to delete this AZ?"
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
