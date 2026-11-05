import { useFormikContext } from "formik";

import FormikField from "@/app/base/components/FormikField";
import type { Props as FormikFieldProps } from "@/app/base/components/FormikField/FormikField";
import { FormikFieldChangeError } from "@/app/base/components/FormikField/FormikField";
import { MAC_ADDRESS_REGEX } from "@/app/base/validation";
import { formatMacAddress } from "@/app/utils";

type Props = FormikFieldProps;

export const MacAddressField = ({
  name,
  ...props
}: Props): React.ReactElement => {
  const { getFieldProps, setFieldValue } = useFormikContext();

  return (
    <FormikField
      name={name}
      onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
        const previousValue = String(getFieldProps(name).value ?? "");
        const formattedValue = formatMacAddress(evt.target.value);
        const shouldValidate =
          MAC_ADDRESS_REGEX.test(previousValue) !==
          MAC_ADDRESS_REGEX.test(formattedValue);
        setFieldValue(name, formattedValue, shouldValidate).catch(
          (reason: unknown) => {
            throw new FormikFieldChangeError(
              name,
              "setFieldValue",
              reason as string
            );
          }
        );
      }}
      placeholder="00:00:00:00:00:00"
      type="text"
      {...props}
    />
  );
};

export default MacAddressField;
