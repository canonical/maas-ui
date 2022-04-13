import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import type { FormikErrors } from "formik";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { FormValues } from "../NodeName";

import DomainSelect from "app/base/components/DomainSelect";
import FormikField from "app/base/components/FormikField";
import domainSelectors from "app/store/domain/selectors";
import { DomainMeta } from "app/store/domain/types";

type Props = {
  saving?: boolean;
  setHostnameError: (
    error: FormikErrors<FormValues>["hostname"] | null
  ) => void;
};

export const NodeNameFields = ({
  saving,
  setHostnameError,
}: Props): JSX.Element => {
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const { errors, values } = useFormikContext<FormValues>();
  const hostnameError = errors.hostname;

  useEffect(() => {
    setHostnameError(hostnameError ?? null);
  }, [hostnameError, setHostnameError]);

  return (
    <>
      <div className="node-name__hostname-wrapper u-no-margin--right">
        <div aria-hidden="true" className="node-name__hostname-spacer">
          {values.hostname}
        </div>
        <FormikField
          type="text"
          className="node-name__hostname"
          disabled={saving}
          displayError={false}
          label="Hostname"
          name="hostname"
          takeFocus
          wrapperClassName="u-no-margin--right"
        />
      </div>
      <span className="node-name__dot u-nudge-right--small u-nudge-left--small u-no-margin--right">
        .
      </span>
      {domainsLoaded ? (
        <DomainSelect
          className="u-no-margin--bottom"
          disabled={saving}
          label="Domain"
          name="domain"
          valueKey={DomainMeta.PK}
          wrapperClassName="node-name__domain"
        />
      ) : (
        <Spinner className="u-width--auto" />
      )}
    </>
  );
};

export default NodeNameFields;
