import { useEffect, useState } from "react";

import { Col, Row, Spinner, Strip } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import AddDeviceInterfaces from "./AddDeviceInterfaces";
import type { AddDeviceValues } from "./types";

import DomainSelect from "app/base/components/DomainSelect";
import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import ZoneSelect from "app/base/components/ZoneSelect";
import { useAddMessage } from "app/base/hooks";
import type { ClearHeaderContent } from "app/base/types";
import { MAC_ADDRESS_REGEX } from "app/base/validation";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import { DeviceIpAssignment } from "app/store/device/types";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  clearHeaderContent: ClearHeaderContent;
};

const AddDeviceSchema = Yup.object().shape({
  domain: Yup.string().required("Domain required"),
  hostname: Yup.string(),
  interfaces: Yup.array()
    .of(
      Yup.object().shape({
        mac: Yup.string()
          .matches(MAC_ADDRESS_REGEX, "Invalid MAC address")
          .required("MAC address is required"),
        ip_assignment: Yup.string().required("IP assignment is required"),
        ip_address: Yup.string().when("ip_assignment", {
          is: (ipAssignment: DeviceIpAssignment) =>
            ipAssignment === DeviceIpAssignment.STATIC ||
            ipAssignment === DeviceIpAssignment.EXTERNAL,
          then: Yup.string().required("IP address is required"),
        }),
        subnet: Yup.number().when("ip_assignment", {
          is: (ipAssignment: DeviceIpAssignment) =>
            ipAssignment === DeviceIpAssignment.STATIC,
          then: Yup.number().required("Subnet is required"),
        }),
      })
    )
    .min(1, "At least one interface must be defined"),
  zone: Yup.string().required("Zone required"),
});

export const AddDeviceForm = ({ clearHeaderContent }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const devicesSaved = useSelector(deviceSelectors.saved);
  const devicesSaving = useSelector(deviceSelectors.saving);
  const devicesErrors = useSelector(deviceSelectors.errors);
  const domains = useSelector(domainSelectors.all);
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  const [secondarySubmit, setSecondarySubmit] = useState(false);
  const [savingDevice, setSavingDevice] = useState<string | null>(null);

  // Fetch all data required for the form.
  useEffect(() => {
    dispatch(domainActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  useAddMessage(
    devicesSaved,
    deviceActions.cleanup,
    `${savingDevice} added successfully.`,
    () => setSavingDevice(null)
  );

  const loaded = domainsLoaded && subnetsLoaded && zonesLoaded;

  if (!loaded) {
    return (
      <Strip>
        <Spinner text="Loading" />
      </Strip>
    );
  }

  return (
    <Formik<AddDeviceValues>
      initialValues={{
        domain: (domains.length && domains[0].name) || "",
        hostname: "",
        interfaces: [
          {
            id: 0,
            ip_address: "",
            ip_assignment: DeviceIpAssignment.DYNAMIC,
            mac: "",
            name: "eth0",
            subnet: "",
          },
        ],
        zone: (zones.length && zones[0].name) || "",
      }}
      onSubmit={(values) => {
        const { domain, hostname, interfaces, zone } = values;
        const normalisedInterfaces = interfaces.map((iface) => ({
          ip_address: iface.ip_address || null,
          ip_assignment: iface.ip_assignment,
          mac: iface.mac,
          name: iface.name,
          subnet: iface.subnet || iface.subnet === 0 ? iface.subnet : null,
        }));
        // We determine the MAC addresses of the device based on the defined
        // interfaces.
        const { primary_mac, extra_macs } = normalisedInterfaces.reduce<{
          primary_mac: string;
          extra_macs: string[];
        }>(
          (split, iface, i) => {
            if (i === 0) {
              split.primary_mac = iface.mac;
            } else {
              split.extra_macs.push(iface.mac);
            }
            return split;
          },
          { primary_mac: "", extra_macs: [] }
        );
        const params = {
          domain: { name: domain },
          extra_macs,
          hostname,
          interfaces: normalisedInterfaces,
          primary_mac,
          zone: { name: zone },
        };
        dispatch(deviceActions.create(params));
        setSavingDevice(values.hostname || "Device");
      }}
      validationSchema={AddDeviceSchema}
    >
      <FormikFormContent<AddDeviceValues>
        cleanup={deviceActions.cleanup}
        errors={devicesErrors}
        onCancel={clearHeaderContent}
        onSaveAnalytics={{
          action: "Add device",
          category: "Device list",
          label: secondarySubmit ? "Save and add another" : "Save device",
        }}
        onSuccess={() => {
          if (!secondarySubmit) {
            clearHeaderContent();
          }
          setSecondarySubmit(false);
        }}
        resetOnSave
        saving={devicesSaving}
        saved={devicesSaved}
        secondarySubmit={(_, { submitForm }) => {
          setSecondarySubmit(true);
          submitForm();
        }}
        secondarySubmitLabel="Save and add another"
        submitLabel="Save device"
      >
        <Row>
          <Col size={5}>
            <FormikField
              label="Device name"
              name="hostname"
              placeholder="Device name (optional)"
              type="text"
            />
            <DomainSelect name="domain" required />
            <ZoneSelect name="zone" required />
          </Col>
        </Row>
        <Strip shallow>
          <AddDeviceInterfaces />
        </Strip>
      </FormikFormContent>
    </Formik>
  );
};

export default AddDeviceForm;
