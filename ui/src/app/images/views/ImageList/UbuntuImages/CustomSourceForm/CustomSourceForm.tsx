import { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import CustomSourceFormFields from "./CustomSourceFormFields";

import FormikForm from "app/base/components/FormikForm";
import type { FormErrors } from "app/base/components/FormikFormContent";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";
import { BootResourceSourceType } from "app/store/bootresource/types";
import type { FetchParams } from "app/store/bootresource/types";
import { preparePayload } from "app/utils";

const CustomSourceSchema = Yup.object()
  .shape({
    keyring_data: Yup.string(),
    keyring_filename: Yup.string(),
    url: Yup.string().required("URL is required"),
  })
  .defined();

export type CustomSourceValues = {
  keyring_data: string;
  keyring_filename: string;
  url: string;
};

const CustomSourceForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(bootResourceSelectors.fetchError);
  const saving = useSelector(bootResourceSelectors.fetching);
  const cleanup = useCallback(() => bootResourceActions.cleanup(), []);

  return (
    <>
      <h4>Mirror URL</h4>
      <p>Add the URL you want to use to select your images from.</p>
      <FormikForm<CustomSourceValues>
        buttonsBordered={false}
        cleanup={cleanup}
        errors={errors as FormErrors}
        initialValues={{
          keyring_data: "",
          keyring_filename: "",
          url: "",
        }}
        onSubmit={(values) => {
          dispatch(cleanup());
          const params = preparePayload({
            ...values,
            source_type: BootResourceSourceType.CUSTOM,
          }) as FetchParams;
          dispatch(bootResourceActions.fetch(params));
        }}
        saving={saving}
        submitLabel="Connect"
        validationSchema={CustomSourceSchema}
      >
        <CustomSourceFormFields />
      </FormikForm>
    </>
  );
};

export default CustomSourceForm;
