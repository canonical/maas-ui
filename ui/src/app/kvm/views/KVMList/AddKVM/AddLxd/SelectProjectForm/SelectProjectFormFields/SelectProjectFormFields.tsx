import { useState } from "react";

import { Col, Icon, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import type { AuthenticateFormValues } from "app/kvm/views/KVMList/AddKVM/AddLxd";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";

type Props = {
  authValues: AuthenticateFormValues;
};

export const SelectProjectFormFields = ({ authValues }: Props): JSX.Element => {
  const projects = useSelector((state: RootState) =>
    podSelectors.getProjectsByLxdServer(state, authValues.power_address)
  );
  const { setFieldValue } = useFormikContext();
  const [newProject, setNewProject] = useState(true);

  return (
    <Row>
      <Col size="5">
        <p data-test="lxd-host-details">
          LXD host: {authValues.name && <strong>{authValues.name}</strong>} (
          {authValues.power_address})
        </p>
        <p className="u-text--muted">
          <span>Connected</span>
          <span className="u-nudge-right--small">
            <Icon name="success" />
          </span>
        </p>
      </Col>
      <Col size="5">
        <Input
          checked={newProject}
          id="new-project"
          label="Add new project"
          name="project-select"
          onChange={() => {
            setNewProject(true);
            setFieldValue("existingProject", "");
          }}
          type="radio"
        />
        <FormikField
          disabled={!newProject}
          name="newProject"
          type="text"
          wrapperClassName="u-nudge-right--x-large u-sv2"
        />
        <Input
          checked={!newProject}
          id="existing-project"
          label="Select existing project"
          name="project-select"
          onChange={() => {
            setNewProject(false);
            setFieldValue("newProject", "");
          }}
          type="radio"
        />
        <FormikField
          component={Select}
          disabled={newProject}
          name="existingProject"
          options={[
            { value: "", label: "Select project", disabled: true },
            ...projects.map((project) => ({
              label: project.name,
              value: project.name,
            })),
          ]}
          wrapperClassName="u-nudge-right--x-large"
        />
      </Col>
    </Row>
  );
};

export default SelectProjectFormFields;
