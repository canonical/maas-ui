import { Col, Row, Select } from "@canonical/react-components";
import React from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import {
  resourcepool as resourcePoolSelectors,
  zone as zoneSelectors,
} from "app/base/selectors";
import { AddKVMFormValues } from "../AddKVMForm";
import generalSelectors from "app/store/general/selectors";
import FormikField from "app/base/components/FormikField";
import PowerTypeFields from "app/machines/components/PowerTypeFields";

export const AddKVMFormFields = (): JSX.Element => {
  const powerTypes = useSelector(generalSelectors.powerTypes.get);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);

  const formikProps = useFormikContext();
  const { values }: AddKVMFormValues = formikProps;

  return (
    <Row>
      <Col size="5">
        <p>KVM host type</p>
        <ul className="p-inline-list">
          <li className="p-inline-list__item u-display-inline-block">
            <FormikField label="virsh" name="type" type="radio" value="virsh" />
          </li>
          <li className="p-inline-list__item u-display-inline-block u-nudge-right">
            <FormikField
              label={
                <>
                  <span>LXD</span>
                  <span className="u-nudge-right--small">
                    <span className="p-label--new u-display-inline">Beta</span>
                  </span>
                </>
              }
              name="type"
              type="radio"
              value="lxd"
            />
          </li>
        </ul>
        <a
          className="p-link--external"
          href="https://maas.io/docs/intro-to-vm-hosting"
        >
          More about KVM hosts in MAAS&hellip;
        </a>
      </Col>
      <Col size="5">
        <FormikField label="Name" name="name" type="text" />
        <FormikField
          component={Select}
          label="Zone"
          name="zone"
          options={[
            { label: "Select your zone", value: "", disabled: true },
            ...zones.map((zone) => ({
              key: `zone-${zone.id}`,
              label: zone.name,
              value: zone.id,
            })),
          ]}
          required
        />
        <FormikField
          component={Select}
          label="Resource pool"
          name="pool"
          options={[
            { label: "Select your resource pool", value: "", disabled: true },
            ...resourcePools.map((pool) => ({
              key: `pool-${pool.id}`,
              label: pool.name,
              value: pool.id,
            })),
          ]}
          required
        />
        <PowerTypeFields
          driverType="pod"
          formikProps={formikProps}
          powerTypes={powerTypes}
          selectedPowerType={values.type}
          showSelect={false}
        />
      </Col>
    </Row>
  );
};

export default AddKVMFormFields;
