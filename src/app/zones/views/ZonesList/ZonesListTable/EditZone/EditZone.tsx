import { Row, Col, Textarea } from "@canonical/react-components";

import { useGetZone, useUpdateZone } from "@/app/api/query/zones";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";

type Props = {
  id: number;
  closeForm: () => void;
};

export type CreateZoneValues = {
  description: string;
  name: string;
};

const EditZone = ({ id, closeForm }: Props): JSX.Element | null => {
  const { data: zone } = useGetZone({ path: { zone_id: id } });

  const editZone = useUpdateZone();

  if (zone) {
    return (
      <FormikForm<CreateZoneValues>
        aria-label="Edit AZ"
        initialValues={{
          description: zone.description,
          name: zone.name,
        }}
        onCancel={closeForm}
        onSubmit={(values) => {
          editZone.mutate({
            body: { name: values.name, description: values.description },
            path: { zone_id: id },
          });
        }}
        onSuccess={closeForm}
        saved={editZone.isSuccess}
        saving={editZone.isPending}
        submitLabel="Update AZ"
      >
        <Row>
          <Col size={12}>
            <FormikField
              label="Name"
              name="name"
              placeholder="Name"
              type="text"
            />
            <FormikField
              component={Textarea}
              label="Description"
              name="description"
            />
          </Col>
        </Row>
      </FormikForm>
    );
  }
  return null;
};

export default EditZone;
