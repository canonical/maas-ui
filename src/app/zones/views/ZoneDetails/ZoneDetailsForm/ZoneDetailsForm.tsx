import React, { useState } from "react";

import { Row, Col, Textarea } from "@canonical/react-components";

import { useGetZone, useUpdateZone } from "@/app/api/query/zones";
import type {
  UpdateZoneData,
  UpdateZoneError,
  ZoneRequest,
} from "@/app/apiclient/codegen";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";

type ZoneDetailsFormProps = {
  id: number;
  closeForm: () => void;
};

const ZoneDetailsForm: React.FC<ZoneDetailsFormProps> = ({ id, closeForm }) => {
  const { data: zone } = useGetZone({ path: { zone_id: id } });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const updateZone = useUpdateZone({ path: { zone_id: id } });

  const onSubmit = (data: ZoneRequest) => {
    setSaving(true);
    setErrors(null);
    updateZone.mutate(
      {
        body: data,
        path: {
          zone_id: id,
        },
      } as UpdateZoneData,
      {
        onSuccess: () => {
          setSaved(true);
          setSaving(false);
          closeForm();
        },
        onError: (error: UpdateZoneError) => {
          setSaving(false);
          setErrors({ general: error.message! });
        },
      }
    );
  };

  if (zone) {
    return (
      <FormikForm<ZoneRequest>
        errors={errors}
        initialValues={{
          description: zone.description,
          name: zone.name,
        }}
        onCancel={closeForm}
        onSubmit={(values) => {
          onSubmit({ name: values.name, description: values.description });
        }}
        onSuccess={closeForm}
        saved={saved}
        saving={saving}
        submitLabel="Update AZ"
      >
        <Row>
          <Col size={6}>
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

export default ZoneDetailsForm;
