import { Col, Row, Select } from "@canonical/react-components";
import React from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { config as configSelectors } from "app/settings/selectors";
import {
  auth as authSelectors,
  general as generalSelectors,
} from "app/base/selectors";
import FormikField from "app/base/components/FormikField";

export const DeployFormFields = () => {
  const { handleChange, setFieldValue, values } = useFormikContext();

  const user = useSelector(authSelectors.get);
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
    <Row>
      <Col size="6">
        <FormikField
          component={Select}
          label="OS"
          name="oSystem"
          options={osOptions}
          onChange={(e) => {
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
        <FormikField
          component={Select}
          label="Release"
          name="release"
          options={releaseOptions}
          onChange={(e) => {
            handleChange(e);
            if (e.target.value !== "bionic") {
              setFieldValue("installKVM", false);
            }
          }}
        />
        {values.oSystem === "ubuntu" && (
          <FormikField
            component={Select}
            label="Kernel"
            name="kernel"
            options={kernelOptions}
          />
        )}
        <p>Additional installs</p>
        <FormikField
          disabled={!canBeKVMHost}
          label="Register as MAAS KVM host"
          name="installKVM"
          type="checkbox"
          wrapperClassName="u-sv-1"
        />
        {!canBeKVMHost && (
          <p data-test="kvm-warning">
            <i className="p-icon--warning is-inline"></i>
            Ubuntu 18.04 is required to create a KVM host.
          </p>
        )}
        <p>
          <a
            className="p-link--external"
            href="https://maas.io/docs/kvm-introduction"
          >
            About MAAS KVM hosts
          </a>
        </p>
        {user.sshkeys_count === 0 && (
          <p data-test="sshkeys-warning">
            <i className="p-icon--warning is-inline"></i>
            Login will not be possible because no SSH keys have been added to
            your account.
            <br />
            To add an SSH key, visit your{" "}
            <Link to="/account/prefs/ssh-keys">account page</Link>.
          </p>
        )}
      </Col>
    </Row>
  );
};

export default DeployFormFields;
