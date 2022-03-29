import { useState } from "react";
import * as React from "react";

import {
  Col,
  Input,
  Notification,
  Row,
  Select,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import type { DeployFormValues } from "../DeployForm";

import FormikField from "app/base/components/FormikField";
import UploadTextArea from "app/base/components/UploadTextArea";
import imagesURLs from "app/images/urls";
import prefsURLs from "app/preferences/urls";
import authSelectors from "app/store/auth/selectors";
import configSelectors from "app/store/config/selectors";
import { osInfo as osInfoSelectors } from "app/store/general/selectors";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";

export const DeployFormFields = (): JSX.Element => {
  const [deployVmHost, setDeployVmHost] = useState(false);
  const [userDataVisible, setUserDataVisible] = useState(false);
  const formikProps = useFormikContext<DeployFormValues>();
  const { handleChange, setFieldValue, values } = formikProps;

  const user = useSelector(authSelectors.get);
  const osOptions = useSelector(configSelectors.defaultOSystemOptions);
  const { osystems = [], releases = [] } =
    useSelector(osInfoSelectors.get) || {};
  const allReleaseOptions = useSelector(osInfoSelectors.getAllOsReleases) || {};
  const releaseOptions = allReleaseOptions[values.oSystem] || [];
  const kernelOptions = useSelector((state: RootState) =>
    osInfoSelectors.getUbuntuKernelOptions(state, values.release)
  );
  const canBeKVMHost =
    values.oSystem === "ubuntu" && ["bionic", "focal"].includes(values.release);
  const noImages = osystems.length === 0 || releases.length === 0;
  const clearVmHostOptions = () => {
    setDeployVmHost(false);
    setFieldValue("vmHostType", "");
  };

  return (
    <>
      {noImages && (
        <Notification data-testid="images-error" severity="negative">
          You will not be able to deploy a machine until at least one valid
          image has been downloaded. To download an image, visit the{" "}
          <Link to={imagesURLs.index}>images page</Link>.
        </Notification>
      )}
      <div className="u-sv2">
        <Row>
          <Col size={3}>
            <FormikField
              component={Select}
              disabled={noImages}
              label="OS"
              name="oSystem"
              options={
                // This won't need to pass the empty array once this issue is fixed:
                // https://github.com/canonical-web-and-design/react-components/issues/570
                osOptions || []
              }
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                handleChange(e);
                const value = e.target.value;
                setFieldValue("kernel", "");
                if (
                  allReleaseOptions[value] &&
                  allReleaseOptions[value].length
                ) {
                  setFieldValue("release", allReleaseOptions[value][0].value);
                }
                if (value !== "ubuntu") {
                  clearVmHostOptions();
                }
              }}
            />
          </Col>
          <Col size={3}>
            <FormikField
              component={Select}
              disabled={noImages}
              label="Release"
              name="release"
              options={releaseOptions}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                handleChange(e);
                setFieldValue("kernel", "");
                if (!["bionic", "focal"].includes(e.target.value)) {
                  clearVmHostOptions();
                }
              }}
            />
          </Col>
          <Col size={3}>
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
          <Col size={3}>
            <p>Customise options</p>
          </Col>
          <Col size={9}>
            <Input
              checked={deployVmHost}
              disabled={!canBeKVMHost || noImages}
              id="deployVmHost"
              label={
                <>
                  Register as MAAS KVM host.{" "}
                  <a href="https://maas.io/docs/kvm-introduction">KVM docs</a>
                </>
              }
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                const { checked } = evt.target;
                if (checked) {
                  setDeployVmHost(true);
                  setFieldValue("vmHostType", PodType.LXD);
                } else {
                  clearVmHostOptions();
                }
              }}
              type="checkbox"
            />
            <p className="p-form-help-text" style={{ paddingLeft: "2rem" }}>
              Only Ubuntu 18.04 LTS and Ubuntu 20.04 LTS are officially
              supported.
            </p>
            {deployVmHost && (
              <>
                <FormikField
                  label="LXD"
                  name="vmHostType"
                  type="radio"
                  value={PodType.LXD}
                  wrapperClassName="u-nudge-right--x-large"
                />
                <FormikField
                  label="libvirt"
                  name="vmHostType"
                  type="radio"
                  value={PodType.VIRSH}
                  wrapperClassName="u-nudge-right--x-large"
                />
              </>
            )}
            <FormikField
              disabled={noImages}
              label={
                <>
                  Cloud-init user-data&hellip;{" "}
                  <a href="https://maas.io/docs/custom-node-setup-preseed#heading--cloud-init">
                    Cloud-init docs
                  </a>
                </>
              }
              name="includeUserData"
              type="checkbox"
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(evt);
                setUserDataVisible(evt.target.checked);
              }}
              wrapperClassName={classNames({
                "u-sv2": userDataVisible,
              })}
            />
            {userDataVisible && (
              <UploadTextArea
                label="Upload script"
                name="userData"
                placeholder="Paste or drop script here."
                rows={10}
              />
            )}
          </Col>
        </Row>
        {user && user.sshkeys_count === 0 && (
          <Row>
            <Col size={12}>
              <p className="u-no-max-width" data-testid="sshkeys-warning">
                <i className="p-icon--warning is-inline"></i>
                Login will not be possible because no SSH keys have been added
                to your account. To add an SSH key, visit your{" "}
                <Link to={prefsURLs.sshKeys.index}>account page</Link>.
              </p>
            </Col>
          </Row>
        )}
        <hr className="u-sv1" />
      </div>
    </>
  );
};

export default DeployFormFields;
