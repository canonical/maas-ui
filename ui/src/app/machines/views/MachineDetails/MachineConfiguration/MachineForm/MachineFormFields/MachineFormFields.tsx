import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { MachineFormValues } from "../MachineForm";

import ArchitectureSelect from "app/base/components/ArchitectureSelect";
import FormikField from "app/base/components/FormikField";
import MinimumKernelSelect from "app/base/components/MinimumKernelSelect";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import TagField from "app/base/components/TagField";
import TagLinks from "app/base/components/TagLinks";
import ZoneSelect from "app/base/components/ZoneSelect";
import machineURLs from "app/machines/urls";
import { FilterMachines } from "app/store/machine/utils";
import tagSelectors from "app/store/tag/selectors";

type Props = { editing: boolean };

const MachineFormFields = ({ editing }: Props): JSX.Element => {
  const tags = useSelector(tagSelectors.all);
  const { initialValues } = useFormikContext<MachineFormValues>();

  return (
    <Row>
      <Col size={6}>
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
            <TagLinks
              getLinkURL={(tag) => {
                const filter = FilterMachines.filtersToQueryString({
                  tags: [`=${tag}`],
                });
                return `${machineURLs.machines.index}${filter}`;
              }}
              tags={initialValues.tags.map((tag) => tag.toString())}
            />
          </>
        )}
      </Col>
    </Row>
  );
};

export default MachineFormFields;
