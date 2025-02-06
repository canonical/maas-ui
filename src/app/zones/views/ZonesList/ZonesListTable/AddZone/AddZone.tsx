import { Row, Col, Textarea } from "@canonical/react-components";

import { useCreateZone } from "@/app/api/query/zones";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";

type Props = {
  closeForm: () => void;
};

export type CreateZoneValues = {
  description: string;
  name: string;
};

const AddZone = ({ closeForm }: Props): JSX.Element => {
  const createZone = useCreateZone();

  return (
    <FormikForm<CreateZoneValues>
      aria-label="Add AZ"
      initialValues={{
        description: "",
        name: "",
      }}
      onCancel={closeForm}
      onSubmit={(values) => {
        createZone.mutate({
          body: { name: values.name, description: values.description },
        });
      }}
      onSuccess={closeForm}
      resetOnSave={true}
      saved={createZone.isSuccess}
      saving={createZone.isPending}
      submitLabel="Add AZ"
    >
      <Row>
        <Col size={12}>
          <FormikField
            label="Name"
            name="name"
            placeholder="Name"
            required
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
};

export default AddZone;
