import { Select, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useFormikContext } from "formik";
import React from "react";

import domainSelectors from "app/store/domain/selectors";
import FormikField from "app/base/components/FormikField";
import type { FormValues } from "../MachineName/MachineName";

type Props = {
  saving?: boolean;
};

export const MachineNameFields = ({ saving }: Props): JSX.Element => {
  const domains = useSelector(domainSelectors.all);
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const { values } = useFormikContext<FormValues>();

  return (
    <>
      <FormikField
        type="text"
        className="machine-name__hostname"
        disabled={saving}
        name="hostname"
        required={true}
        style={{ width: `${values.hostname.length}ch` }}
        takeFocus
        wrapperClassName="u-nudge-left--small"
      />
      <span>.</span>
      {domainsLoaded ? (
        <FormikField
          className="u-no-margin--bottom"
          component={Select}
          disabled={saving}
          name="domain"
          options={domains.map((domain) => ({
            label: domain.name,
            value: domain.id,
          }))}
          required
          wrapperClassName="u-no-margin--left u-nudge-right--small u-nudge-left--small"
        />
      ) : (
        <Spinner className="u-width--auto" inline />
      )}
    </>
  );
};

export default MachineNameFields;
