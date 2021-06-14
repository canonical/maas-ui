import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import SectionHeader from "app/base/components/SectionHeader";
import type { RootState } from "app/store/root/types";
import { actions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  id: number;
};

const ZoneDetailsHeader = ({ id }: Props): JSX.Element => {
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, Number(id))
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  let buttons: JSX.Element[] | null = [
    <Button appearance="neutral" data-test="delete-zone" key="delete-zone">
      Delete AZ
    </Button>,
  ];

  let title = "";

  if (zonesLoaded && zone) {
    title = `Availability zone: ${zone.name}`;
  } else if (zonesLoaded) {
    title = "Availability zone not found";
    buttons = null;
  }

  return (
    <SectionHeader buttons={buttons} loading={!zonesLoaded} title={title} />
  );
};

export default ZoneDetailsHeader;
