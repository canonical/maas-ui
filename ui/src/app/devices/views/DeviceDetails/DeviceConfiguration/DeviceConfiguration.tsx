import { useEffect } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import DeviceConfigurationFields from "./DeviceConfigurationFields";
import type { DeviceConfigurationValues } from "./types";

import Definition from "app/base/components/Definition";
import EditableSection from "app/base/components/EditableSection";
import FormikFormContent from "app/base/components/FormikFormContent";
import TagLinks from "app/base/components/TagLinks";
import { useWindowTitle } from "app/base/hooks";
import deviceURLs from "app/devices/urls";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import type { Device, DeviceMeta } from "app/store/device/types";
import { FilterDevices, isDeviceDetails } from "app/store/device/utils";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  systemId: Device[DeviceMeta.PK];
};

export enum Label {
  Form = "Device configuration",
}

const DeviceConfigurationSchema = Yup.object().shape({
  description: Yup.string(),
  tags: Yup.array().of(Yup.number()),
  zone: Yup.string(),
});

const DeviceConfiguration = ({ systemId }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, systemId)
  );
  const updateDeviceError = useSelector((state: RootState) =>
    deviceSelectors.eventErrorsForDevices(state, systemId, "update")
  )[0]?.error;
  const deviceSaved = useSelector(deviceSelectors.saved);
  const deviceSaving = useSelector(deviceSelectors.saving);
  const deviceTags = useSelector((state: RootState) =>
    tagSelectors.getByIDs(state, device?.tags || null)
  );
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const loaded = isDeviceDetails(device) && zonesLoaded;
  useWindowTitle(`${`${device?.hostname}` || "Device"} configuration`);

  useEffect(() => {
    dispatch(zoneActions.fetch());
  });

  if (!loaded) {
    return (
      <Strip data-testid="loading-device" shallow>
        <Spinner text="Loading..." />
      </Strip>
    );
  }
  return (
    <EditableSection
      className="u-no-padding--top"
      hasSidebarTitle
      renderContent={(editing, setEditing) =>
        editing ? (
          <Formik
            initialValues={{
              description: device.description,
              tags: device.tags,
              zone: device.zone?.name || "",
            }}
            onSubmit={(values) => {
              const params = {
                description: values.description,
                system_id: device.system_id,
                tags: values.tags,
                zone: { name: values.zone },
              };
              dispatch(deviceActions.update(params));
            }}
            validationSchema={DeviceConfigurationSchema}
          >
            <FormikFormContent<DeviceConfigurationValues>
              aria-label={Label.Form}
              cleanup={deviceActions.cleanup}
              data-testid="device-config-form"
              editable={editing}
              errors={updateDeviceError}
              onSaveAnalytics={{
                action: "Configure device",
                category: "Device details",
                label: "Save changes",
              }}
              onCancel={() => setEditing(false)}
              onSuccess={() => setEditing(false)}
              saved={deviceSaved}
              saving={deviceSaving}
              submitLabel="Save changes"
            >
              <DeviceConfigurationFields />
            </FormikFormContent>
          </Formik>
        ) : (
          <div data-testid="device-details">
            <Definition label="Zone" description={device.zone.name} />
            <Definition label="Note" description={device.description} />
            <Definition label="Tags">
              {device.tags.length ? (
                <TagLinks
                  getLinkURL={(tag) => {
                    const filter = FilterDevices.filtersToQueryString({
                      tags: [`=${tag.name}`],
                    });
                    return `${deviceURLs.devices.index}${filter}`;
                  }}
                  tags={deviceTags}
                />
              ) : null}
            </Definition>
          </div>
        )
      }
      title="Device configuration"
    />
  );
};

export default DeviceConfiguration;
