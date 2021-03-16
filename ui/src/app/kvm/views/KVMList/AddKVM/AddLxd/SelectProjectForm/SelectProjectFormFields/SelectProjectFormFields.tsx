import { useState } from "react";

import {
  Col,
  Icon,
  Input,
  Notification,
  Row,
} from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import FormikField from "app/base/components/FormikField";
import type { AuthenticateFormValues } from "app/kvm/views/KVMList/AddKVM/AddLxd";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";

type Props = {
  authValues: AuthenticateFormValues;
};

export const SelectProjectFormFields = ({ authValues }: Props): JSX.Element => {
  const podsInServer = useSelector((state: RootState) =>
    podSelectors.getByLxdServer(state, authValues.power_address)
  );
  const projects = useSelector((state: RootState) =>
    podSelectors.getProjectsByLxdServer(state, authValues.power_address)
  );
  const { setFieldValue } = useFormikContext();
  const [newProject, setNewProject] = useState(true);
  const freeProjects = projects.filter(
    (project) => !podsInServer.some((pod) => pod.project === project.name)
  );

  return (
    <Row>
      {!newProject && (
        <Col size="12">
          <Notification data-test="existing-project-warning" type="caution">
            MAAS will recommission all VMs in the selected project.
          </Notification>
        </Col>
      )}
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
          disabled={freeProjects.length === 0}
          id="existing-project"
          label="Select existing project"
          name="project-select"
          onChange={() => {
            setNewProject(false);
            setFieldValue("newProject", "");
            setFieldValue("existingProject", freeProjects[0]?.name || "");
          }}
          type="radio"
        />
        {projects.map((project) => {
          const projectPod = podsInServer.find(
            (pod) => pod.project === project.name
          );
          return (
            <div className="u-flex" key={project.name}>
              <FormikField
                disabled={newProject || Boolean(projectPod)}
                label={project.name}
                name="existingProject"
                type="radio"
                value={project.name}
                wrapperClassName="u-nudge-right--x-large"
              />
              {!newProject && projectPod && (
                <label className="u-nudge-right" data-test="existing-pod">
                  <Link to={`/kvm/${projectPod.id}`}>already exists</Link>
                </label>
              )}
            </div>
          );
        })}
      </Col>
    </Row>
  );
};

export default SelectProjectFormFields;
