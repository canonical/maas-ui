import { useEffect, useState } from "react";

import {
  Button,
  Col,
  Row,
  Spinner,
  Strip,
  Textarea,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import TagField from "app/base/components/TagField";
import TagLinks from "app/base/components/TagLinks";
import ZoneSelect from "app/base/components/ZoneSelect";
import { useWindowTitle } from "app/base/hooks";
import deviceURLs from "app/devices/urls";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import type { Device, DeviceMeta } from "app/store/device/types";
import { FilterDevices, isDeviceDetails } from "app/store/device/utils";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import type { Tag, TagMeta } from "app/store/tag/types";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type DeviceConfigurationValues = {
  description: string;
  tags: Tag[TagMeta.PK][];
  zone: string;
};

type Props = {
  systemId: Device[DeviceMeta.PK];
};

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
  const allTags = useSelector(tagSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const [editing, setEditing] = useState(false);
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
    <Strip shallow>
      <div className="u-flex--between">
        <h4>Device configuration</h4>
        {!editing && (
          <Button
            className="u-no-margin--bottom"
            data-testid="edit-device-button"
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>
      {editing ? (
        <FormikForm<DeviceConfigurationValues>
          cleanup={deviceActions.cleanup}
          data-testid="device-config-form"
          editable={editing}
          errors={updateDeviceError}
          initialValues={{
            description: device.description,
            tags: device.tags,
            zone: device.zone?.name || "",
          }}
          onSaveAnalytics={{
            action: "Configure device",
            category: "Device details",
            label: "Save changes",
          }}
          onCancel={() => setEditing(false)}
          onSubmit={(values) => {
            const params = {
              description: values.description,
              system_id: device.system_id,
              tags: values.tags,
              zone: { name: values.zone },
            };
            dispatch(deviceActions.update(params));
          }}
          onSuccess={() => setEditing(false)}
          saved={deviceSaved}
          saving={deviceSaving}
          submitLabel="Save changes"
          validationSchema={DeviceConfigurationSchema}
        >
          <Row>
            <Col size={6}>
              <ZoneSelect name="zone" />
              <FormikField
                component={Textarea}
                label="Note"
                name="description"
              />
              <TagField
                name="tags"
                placeholder="Create or remove tags"
                tagList={allTags.map((tag) => tag.name)}
              />
            </Col>
          </Row>
        </FormikForm>
      ) : (
        <div data-testid="device-details">
          <div>
            <p className="u-text--muted">Zone</p>
            <p>{device.zone.name}</p>
          </div>
          <div>
            <p className="u-text--muted">Note</p>
            <p>{device.description || "—"}</p>
          </div>
          <div>
            <p className="u-text--muted">Tags</p>
            <p>
              {device.tags.length ? (
                <TagLinks
                  getLinkURL={(tag) => {
                    const filter = FilterDevices.filtersToQueryString({
                      tags: [`=${tag}`],
                    });
                    return `${deviceURLs.devices.index}${filter}`;
                  }}
                  tags={device.tags.map((tag) => tag.toString())}
                />
              ) : (
                "—"
              )}
            </p>
          </div>
        </div>
      )}
    </Strip>
  );
};

export default DeviceConfiguration;
