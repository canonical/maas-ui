import { Col, List, Row, Select } from "@canonical/react-components";
import React from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { config as configSelectors } from "app/settings/selectors";
import {
  auth as authSelectors,
  general as generalSelectors,
} from "app/base/selectors";
import { DeployFormValues } from "../DeployForm";
import { User } from "app/base/types";
import FormikField from "app/base/components/FormikField";

export const DeployFormFields = (): JSX.Element => {
  const formikProps = useFormikContext<DeployFormValues>();
  const { handleChange, setFieldValue } = formikProps;
  const { values }: { values: DeployFormValues } = formikProps;

  const user: User = useSelector(authSelectors.get);
  const osOptions = useSelector(configSelectors.defaultOSystemOptions);
  const allReleaseOptions = useSelector(
    generalSelectors.osInfo.getAllOsReleases
  );
  const releaseOptions = allReleaseOptions[values.oSystem];
  const kernelOptions = useSelector((state) =>
    generalSelectors.osInfo.getUbuntuKernelOptions(state, values.release)
  );
  const canBeKVMHost =
    values.oSystem === "ubuntu" && values.release === "bionic";

  return (
    <div className="u-sv2">
      <Row>
        <Col size="3">
          <FormikField
            component={Select}
            label="OS"
            name="oSystem"
            options={osOptions}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(e);
              const value = e.target.value;
              if (allReleaseOptions[value] && allReleaseOptions[value].length) {
                setFieldValue("release", allReleaseOptions[value][0].value);
              }
              if (value !== "ubuntu") {
                setFieldValue("installKVM", false);
              }
            }}
          />
        </Col>
        <Col size="3">
          <FormikField
            component={Select}
            label="Release"
            name="release"
            options={releaseOptions}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(e);
              if (e.target.value !== "bionic") {
                setFieldValue("installKVM", false);
              }
            }}
          />
        </Col>
        <Col size="3">
          {values.oSystem === "ubuntu" && (
            <FormikField
              component={Select}
              label="Kernel"
              name="kernel"
              options={kernelOptions}
            />
          )}
        </Col>
      </Row>
      <div className="u-sv2">
        <hr className="u-sv2" />
      </div>
      <Row>
        <Col size="3">
          <p>Customise options</p>
        </Col>
        <Col size="9">
          <List
            items={[
              <FormikField
                disabled={!canBeKVMHost}
                label="Register as MAAS KVM host (Ubuntu 18.04 LTS required)."
                name="installKVM"
                type="checkbox"
                wrapperClassName="u-sv-1 u-display-inline-block"
              />,
              <a
                className="p-link--external"
                href="https://maas.io/docs/kvm-introduction"
              >
                Read more
              </a>,
            ]}
            inline
          />
        </Col>
      </Row>
      {user.sshkeys_count === 0 && (
        <Row>
          <Col size="12">
            <p data-test="sshkeys-warning">
              <i className="p-icon--warning is-inline"></i>
              Login will not be possible because no SSH keys have been added to
              your account.
              <br />
              To add an SSH key, visit your{" "}
              <Link to="/account/prefs/ssh-keys">account page</Link>.
            </p>
          </Col>
        </Row>
      )}
      <hr className="u-sv1" />
    </div>
  );
};

export default DeployFormFields;
