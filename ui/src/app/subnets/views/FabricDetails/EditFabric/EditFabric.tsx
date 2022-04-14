import { useCallback } from "react";

import { Col, Row, Spinner, Textarea } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FabricController from "../FabricSummary/FabricController";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric, FabricMeta } from "app/store/fabric/types";
import type { RootState } from "app/store/root/types";

type Props = {
  close: () => void;
  id: Fabric[FabricMeta.PK];
};

export type FormValues = {
  name: Fabric["name"];
  description: Fabric["description"];
};

const Schema = Yup.object().shape({
  name: Yup.string(),
  description: Yup.string(),
});

const EditFabric = ({ close, id }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const fabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, id)
  );
  const saved = useSelector(fabricSelectors.saved);
  const saving = useSelector(fabricSelectors.saving);
  const errors = useSelector(fabricSelectors.errors);
  const cleanup = useCallback(() => fabricActions.cleanup(), []);

  if (!fabric) {
    return (
      <span data-testid="Spinner">
        <Spinner text="Loading..." />
      </span>
    );
  }
  return (
    <Formik
      initialValues={{
        name: fabric.name,
        description: fabric.description,
      }}
      onSubmit={({ name, description }) => {
        // Clear the errors from the previous submission.
        dispatch(cleanup());
        dispatch(
          fabricActions.update({
            id: fabric.id,
            name,
            description,
          })
        );
      }}
      validationSchema={Schema}
    >
      <FormikFormContent<FormValues>
        aria-label="Edit fabric summary"
        cleanup={cleanup}
        errors={errors}
        onSaveAnalytics={{
          action: "Save fabric",
          category: "Fabric details",
          label: "Edit fabric form",
        }}
        onCancel={close}
        onSuccess={() => close()}
        resetOnSave
        saved={saved}
        saving={saving}
        submitLabel="Save summary"
      >
        <Row>
          <Col size={6}>
            <FormikField label="Name" name="name" type="text" />
            <FormikField
              component={Textarea}
              label="Description"
              name="description"
            />
            <FabricController id={fabric.id} />
          </Col>
        </Row>
      </FormikFormContent>
    </Formik>
  );
};

export default EditFabric;
