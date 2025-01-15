import React, { useState } from "react";

import { Row, Col, Textarea } from "@canonical/react-components";

import { useCreateZone } from "@/app/api/query/zones";
import type {
  CreateZoneData,
  CreateZoneError,
  ZoneRequest,
} from "@/app/apiclient/codegen/types.gen";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";

type ZoneListFormProps = {
  closeForm: () => void;
};

const ZonesListForm: React.FC<ZoneListFormProps> = ({ closeForm }) => {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const createZone = useCreateZone();

  const onSubmit = (data: ZoneRequest) => {
    setSaving(true);
    setErrors(null);
    createZone.mutate(
      {
        body: data,
      } as CreateZoneData,
      {
        onSuccess: () => {
          setSaved(true);
          setSaving(false);
          closeForm();
        },
        onError: (error: CreateZoneError) => {
          setSaving(false);
          setErrors({ general: error.message! });
        },
      }
    );
  };

  return (
    <FormikForm<ZoneRequest>
      aria-label="Add AZ"
      errors={errors}
      initialValues={{
        description: "",
        name: "",
      }}
      onCancel={closeForm}
      onSubmit={(values) => {
        onSubmit({ name: values.name, description: values.description });
      }}
      onSuccess={closeForm}
      resetOnSave={true}
      saved={saved}
      saving={saving}
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

export default ZonesListForm;
