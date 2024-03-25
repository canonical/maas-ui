import { useEffect, useState } from "react";
import * as React from "react";

import { ExternalLink } from "@canonical/maas-react-components";
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

import FormikField from "@/app/base/components/FormikField";
import TooltipButton from "@/app/base/components/TooltipButton";
import UploadTextArea from "@/app/base/components/UploadTextArea";
import docsUrls from "@/app/base/docsUrls";
import urls from "@/app/base/urls";
import authSelectors from "@/app/store/auth/selectors";
import configSelectors from "@/app/store/config/selectors";
import {
  osInfo as osInfoSelectors,
  defaultMinHweKernel as defaultMinHweKernelSelectors,
} from "@/app/store/general/selectors";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import { timeSpanToMinutes } from "@/app/utils";

export const DeployFormFields = (): JSX.Element => {
  const [deployVmHost, setDeployVmHost] = useState(false);
  const [userDataVisible, setUserDataVisible] = useState(false);
  const formikProps = useFormikContext<DeployFormValues>();
  const { handleChange, setFieldValue, values } = formikProps;

  const user = useSelector(authSelectors.get);
  const osOptions = useSelector(configSelectors.defaultOSystemOptions);
  const defaultMinHweKernel = useSelector(defaultMinHweKernelSelectors.get);
  const { osystems = [], releases = [] } =
    useSelector(osInfoSelectors.get) || {};
  const allReleaseOptions = useSelector(osInfoSelectors.getAllOsReleases) || {};
  const releaseOptions = allReleaseOptions[values.oSystem] || [];
  const kernelOptions = useSelector((state: RootState) =>
    osInfoSelectors.getUbuntuKernelOptions(state, values.release)
  );
  const canBeKVMHost =
    values.oSystem === "ubuntu" &&
    ["bionic", "focal", "jammy"].includes(values.release);
  const noImages = osystems.length === 0 || releases.length === 0;
  const clearVmHostOptions = () => {
    setDeployVmHost(false);
    setFieldValue("vmHostType", "");
  };
  const hardwareSyncInterval = useSelector(
    configSelectors.hardwareSyncInterval
  );

  // When the kernel options change then reset the selected kernel. If the
  // selected release contains the default kernel then select it.
  useEffect(() => {
    if (defaultMinHweKernel) {
      if (kernelOptions.find(({ value }) => value === defaultMinHweKernel)) {
        setFieldValue("kernel", defaultMinHweKernel);
      } else {
        setFieldValue("kernel", "");
      }
    }
  }, [defaultMinHweKernel, kernelOptions, setFieldValue]);

  return (
    <>
      {noImages && (
        <Notification data-testid="images-error" severity="negative">
          You will not be able to deploy a machine until at least one valid
          image has been downloaded. To download an image, visit the{" "}
          <Link to={urls.images.index}>images page</Link>.
        </Notification>
      )}
      <div className="u-sv2">
        <Row>
          <Col size={12}>
            <FormikField
              component={Select}
              disabled={noImages}
              label="OS"
              name="oSystem"
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
              options={osOptions}
            />
          </Col>
          <Col size={12}>
            <FormikField
              component={Select}
              disabled={noImages}
              label="Release"
              name="release"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                handleChange(e);
                setFieldValue("kernel", "");
                if (!["bionic", "focal"].includes(e.target.value)) {
                  clearVmHostOptions();
                }
              }}
              options={releaseOptions}
            />
          </Col>
          <Col size={12}>
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
          <Col size={12}>
            <p>Deployment target</p>
          </Col>
          <Col size={12}>
            <Input
              checked={!values.ephemeralDeploy}
              label="Deploy to disk"
              name="ephemeralDeploy"
              onChange={() => {
                setFieldValue("ephemeralDeploy", false);
              }}
              type="radio"
            />
            <Input
              checked={values.ephemeralDeploy}
              help="No disk layout will be applied during deployment. All system data will be reset upon reboot or shutdown."
              label="Deploy in memory"
              name="ephemeralDeploy"
              onChange={() => {
                setFieldValue("ephemeralDeploy", true);
              }}
              type="radio"
            />
          </Col>
        </Row>
        <div className="u-sv2">
          <hr className="u-sv2" />
        </div>
        <Row>
          <Col size={12}>
            <p>Customise options</p>
          </Col>
          <Col size={12}>
            {!values.ephemeralDeploy && (
              <>
                <Input
                  checked={deployVmHost}
                  disabled={!canBeKVMHost || noImages}
                  help={
                    values.vmHostType === PodType.VIRSH
                      ? "Only Ubuntu 18.04 LTS and Ubuntu 20.04 LTS are officially supported."
                      : undefined
                  }
                  id="deployVmHost"
                  label={
                    <>
                      Register as MAAS KVM host.{" "}
                      <ExternalLink to={docsUrls.kvmIntroduction}>
                        KVM docs
                      </ExternalLink>
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
              </>
            )}
            <FormikField
              aria-label="Cloud-init user-data"
              disabled={noImages}
              label={
                <>
                  Cloud-init user-data&hellip;{" "}
                  <ExternalLink to={docsUrls.cloudInit}>
                    Cloud-init docs
                  </ExternalLink>
                </>
              }
              name="includeUserData"
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(evt);
                setUserDataVisible(evt.target.checked);
              }}
              type="checkbox"
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
            <FormikField
              help={
                <>
                  Hardware sync interval:{" "}
                  {!hardwareSyncInterval
                    ? "Invalid"
                    : `${timeSpanToMinutes(hardwareSyncInterval)} minutes`}{" "}
                  - Admins can change this in the global settings.
                </>
              }
              label={
                <>
                  Periodically sync hardware{" "}
                  <TooltipButton
                    aria-label="more about periodically sync hardware"
                    message={`Enable this to make MAAS periodically check the
                  hardware configuration of this machine and reflect any
                  possible change after the deployment.`}
                    positionElementClassName="u-display--inline"
                  />{" "}
                  <ExternalLink to={docsUrls.customisingDeployedMachines}>
                    Hardware sync docs
                  </ExternalLink>
                </>
              }
              name="enableHwSync"
              type="checkbox"
            />
          </Col>
        </Row>
        {user && user.sshkeys_count === 0 && (
          <Row>
            <Col size={12}>
              <p className="u-no-max-width" data-testid="sshkeys-warning">
                <i className="p-icon--warning is-inline"></i>
                Login will not be possible because no SSH keys have been added
                to your account. To add an SSH key, visit your{" "}
                <Link to={urls.preferences.sshKeys.index}>account page</Link>.
              </p>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default DeployFormFields;
