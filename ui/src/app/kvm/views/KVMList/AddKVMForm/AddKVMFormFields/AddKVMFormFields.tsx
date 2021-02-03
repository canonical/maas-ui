import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { AddKVMFormValues } from "../AddKVMForm";

import FormikField from "app/base/components/FormikField";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import ZoneSelect from "app/base/components/ZoneSelect";
import PowerTypeFields from "app/machines/components/PowerTypeFields";
import generalSelectors from "app/store/general/selectors";

export const AddKVMFormFields = (): JSX.Element => {
  const powerTypes = useSelector(generalSelectors.powerTypes.get);

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
        <ZoneSelect name="zone" required valueKey="id" />
        <ResourcePoolSelect name="pool" required valueKey="id" />
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
