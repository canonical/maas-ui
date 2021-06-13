import { useCallback } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import CustomSourceConnectFields from "./CustomSourceConnectFields";

import FormikForm from "app/base/components/FormikForm";
import type { FormErrors } from "app/base/components/FormikFormContent";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";
import { BootResourceSourceType } from "app/store/bootresource/types";
import type { FetchParams } from "app/store/bootresource/types";
import { preparePayload } from "app/utils";

const CustomSourceConnectSchema = Yup.object()
  .shape({
    keyring_data: Yup.string(),
    keyring_filename: Yup.string(),
    url: Yup.string().required("URL is required"),
  })
  .defined();

export type CustomSourceConnectValues = {
  keyring_data: string;
  keyring_filename: string;
  url: string;
};

type Props = {
  setConnected: (connected: boolean) => void;
  setSourceUrl: (sourceUrl: string) => void;
};

const CustomSourceConnect = ({
  setConnected,
  setSourceUrl,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(bootResourceSelectors.fetchError);
  const saving = useSelector(bootResourceSelectors.fetching);
  const previousSaving = usePrevious(saving);
  const cleanup = useCallback(() => bootResourceActions.cleanup(), []);
  // Consider the connection established if fetching was started, then stopped
  // without any errors.
  const saved = !saving && previousSaving && !errors;

  return (
    <FormikForm<CustomSourceConnectValues>
      buttonsBordered={false}
      cleanup={cleanup}
      errors={errors as FormErrors}
      initialValues={{
        keyring_data: "",
        keyring_filename: "",
        url: "",
      }}
      onSubmit={(values) => {
        setSourceUrl(values.url);
        dispatch(cleanup());
        const params = preparePayload({
          ...values,
          source_type: BootResourceSourceType.CUSTOM,
        }) as FetchParams;
        dispatch(bootResourceActions.fetch(params));
      }}
      onSuccess={() => setConnected(true)}
      saved={saved}
      saving={saving}
      submitLabel="Connect"
      validationSchema={CustomSourceConnectSchema}
    >
      <CustomSourceConnectFields />
    </FormikForm>
  );
};

export default CustomSourceConnect;
