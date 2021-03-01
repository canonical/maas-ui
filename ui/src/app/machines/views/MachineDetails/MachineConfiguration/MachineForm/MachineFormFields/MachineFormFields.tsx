import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { MachineFormValues } from "../MachineForm";

import ArchitectureSelect from "app/base/components/ArchitectureSelect";
import FormikField from "app/base/components/FormikField";
import MinimumKernelSelect from "app/base/components/MinimumKernelSelect";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import TagField from "app/base/components/TagField";
import ZoneSelect from "app/base/components/ZoneSelect";
import TagLinks from "app/machines/components/TagLinks";
import tagSelectors from "app/store/tag/selectors";

type Props = { editing: boolean };

const MachineFormFields = ({ editing }: Props): JSX.Element => {
  const tags = useSelector(tagSelectors.all);
  const { initialValues } = useFormikContext<MachineFormValues>();
  const sortedInitialTags = [...initialValues.tags].sort();

  return (
    <Row>
      <Col size="6">
        <ArchitectureSelect disabled={!editing} name="architecture" />
        <MinimumKernelSelect disabled={!editing} name="minHweKernel" />
        <ZoneSelect disabled={!editing} name="zone" />
        <ResourcePoolSelect disabled={!editing} name="pool" />
        <FormikField
          disabled={!editing}
          label="Note"
          name="description"
          type="text"
        />
        {editing ? (
          <TagField tagList={tags.map(({ name }) => name)} />
        ) : (
          <>
            <p>Tags</p>
            <p>
              <TagLinks filterType="tags" tags={sortedInitialTags} />
            </p>
          </>
        )}
      </Col>
    </Row>
  );
};

export default MachineFormFields;
