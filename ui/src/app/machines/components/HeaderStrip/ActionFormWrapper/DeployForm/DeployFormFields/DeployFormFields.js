import { Col, Notification, Row, Select } from "@canonical/react-components";
import React from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { generateLegacyURL } from "app/utils";
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
  const { osystems, releases } = useSelector(generalSelectors.osInfo.get);
  const allReleaseOptions = useSelector(
    generalSelectors.osInfo.getAllOsReleases
  );
  const releaseOptions = allReleaseOptions[values.oSystem] || [];
  const kernelOptions = useSelector((state) =>
    generalSelectors.osInfo.getUbuntuKernelOptions(state, values.release)
  );
  const canBeKVMHost =
    values.oSystem === "ubuntu" && values.release === "bionic";
  const imagesURL = generateLegacyURL("/images");
  const noImages = osystems.length === 0 || releases.length === 0;

  return (
    <>
      {noImages && (
        <Notification data-test="images-error" type="negative">
          You will not be able to deploy a machine until at least one valid
          image has been downloaded. To download an image, visit the{" "}
          <a
            href={imagesURL}
            onClick={(evt) => {
              evt.preventDefault();
              window.history.pushState(null, null, imagesURL);
            }}
          >
            images page
          </a>
          .
        </Notification>
      )}
      <Row>
        <Col size="6">
          <FormikField
            component={Select}
            disabled={noImages}
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
            disabled={noImages}
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
          <ul className="p-inline-list">
            <li
              className="p-inline-list__item"
              style={{ display: "inline-block" }}
            >
              <FormikField
                disabled={!canBeKVMHost || noImages}
                label="Register as MAAS KVM host"
                name="installKVM"
                type="checkbox"
                wrapperClassName="u-sv-1"
              />
            </li>
            <li className="p-inline-list__item">
              <a
                className="p-link--external"
                href="https://maas.io/docs/kvm-introduction"
              >
                About MAAS KVM hosts
              </a>
            </li>
          </ul>
          {!canBeKVMHost && (
            <p data-test="kvm-warning">
              <i className="p-icon--warning is-inline"></i>
              Ubuntu 18.04 is required to create a KVM host.
            </p>
          )}
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
    </>
  );
};

export default DeployFormFields;
