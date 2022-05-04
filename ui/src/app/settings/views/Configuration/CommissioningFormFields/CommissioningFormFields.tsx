import type { ChangeEvent } from "react";

import { Link, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { CommissioningFormValues } from "../CommissioningForm";

import FormikField from "app/base/components/FormikField";
import TooltipButton from "app/base/components/TooltipButton";
import docsUrls from "app/base/docsUrls";
import configSelectors from "app/store/config/selectors";
import { osInfo as osInfoSelectors } from "app/store/general/selectors";
import type { RootState } from "app/store/root/types";

const CommissioningFormFields = (): JSX.Element => {
  const formikProps = useFormikContext<CommissioningFormValues>();
  const distroSeriesOptions = useSelector(configSelectors.distroSeriesOptions);

  const ubuntuKernelOptions = useSelector((state: RootState) =>
    osInfoSelectors.getUbuntuKernelOptions(
      state,
      formikProps.values.commissioning_distro_series
    )
  );

  const allUbuntuKernelOptions = useSelector(
    osInfoSelectors.getAllUbuntuKernelOptions
  );

  return (
    <>
      <h5 className="u-sv1">Machine settings</h5>
      <FormikField
        label="Default Ubuntu release used for commissioning"
        component={Select}
        options={
          // This won't need to pass the empty array once this issue is fixed:
          // https://github.com/canonical-web-and-design/react-components/issues/570
          distroSeriesOptions || []
        }
        name="commissioning_distro_series"
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          const kernelValue =
            allUbuntuKernelOptions[e.target.value] &&
            allUbuntuKernelOptions[e.target.value][0].value;

          formikProps.handleChange(e);
          formikProps.setFieldTouched(
            "commissioning_distro_series",
            true,
            true
          );
          formikProps.setFieldValue("default_min_hwe_kernel", kernelValue);
          formikProps.setFieldTouched("default_min_hwe_kernel", true, true);
        }}
      />
      <FormikField
        label="Default minimum kernel version"
        component={Select}
        options={ubuntuKernelOptions}
        help="The default minimum kernel version used on all new and commissioned nodes"
        name="default_min_hwe_kernel"
      />
      <h5 className="u-sv1">IPMI settings</h5>
      <FormikField
        autoComplete="username"
        label="MAAS generated IPMI username"
        name="maas_auto_ipmi_user"
        placeholder="maas"
        type="text"
      />
      <FormikField
        autoComplete="new-password"
        help={
          <>
            Specify this key to encrypt all communication between IPMI clients
            and the BMC. Leave this blank for no encryption.&nbsp;
            <Link
              href={docsUrls.ipmi}
              rel="noreferrer noopener"
              target="_blank"
            >
              IPMI and BMC key
            </Link>
          </>
        }
        label={
          <>
            K_g BMC key&nbsp;
            <TooltipButton
              iconName="help"
              message="Once set, the IPMI K_g BMC key is REQUIRED after next commissioning."
            />
          </>
        }
        name="maas_auto_ipmi_k_g_bmc_key"
        type="password"
      />
      <p className="u-sv1">MAAS generated IPMI user privilege level</p>
      <FormikField
        name="maas_auto_ipmi_user_privilege_level"
        value="ADMIN"
        label="Admin"
        type="radio"
      />
      <FormikField
        name="maas_auto_ipmi_user_privilege_level"
        value="OPERATOR"
        label="Operator"
        type="radio"
      />
      <FormikField
        name="maas_auto_ipmi_user_privilege_level"
        value="USER"
        label="User"
        type="radio"
      />
    </>
  );
};

export default CommissioningFormFields;
