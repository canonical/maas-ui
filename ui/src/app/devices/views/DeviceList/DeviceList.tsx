import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import DeviceListHeader from "./DeviceListHeader";
import DeviceListTable from "./DeviceListTable";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import type { DeviceHeaderContent } from "app/devices/types";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";

const DeviceList = (): JSX.Element => {
  const dispatch = useDispatch();
  const devices = useSelector(deviceSelectors.all);
  const [headerContent, setHeaderContent] =
    useState<DeviceHeaderContent | null>(null);
  useWindowTitle("Devices");

  useEffect(() => {
    dispatch(deviceActions.fetch());
  }, [dispatch]);

  return (
    <Section
      header={
        <DeviceListHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
        />
      }
    >
      <DeviceListTable devices={devices} />
    </Section>
  );
};

export default DeviceList;
