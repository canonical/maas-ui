import { Spinner } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { FormValues } from "../NodeName";

import DomainSelect from "app/base/components/DomainSelect";
import FormikField from "app/base/components/FormikField";
import domainSelectors from "app/store/domain/selectors";
import { DomainMeta } from "app/store/domain/types";

type Props = {
  saving?: boolean;
};

export const NodeNameFields = ({ saving }: Props): JSX.Element => {
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const { values } = useFormikContext<FormValues>();

  return (
    <>
      <FormikField
        type="text"
        className="node-name__hostname"
        disabled={saving}
        name="hostname"
        required={true}
        style={{ width: `${values.hostname.length}ch` }}
        takeFocus
        wrapperClassName="u-nudge-left--small u-no-margin--right"
      />
      <span className="u-nudge-left--small u-no-margin--right">.</span>
      {domainsLoaded ? (
        <DomainSelect
          className="u-no-margin--bottom"
          disabled={saving}
          name="domain"
          required
          valueKey={DomainMeta.PK}
          wrapperClassName="u-nudge-left u-no-margin--right"
        />
      ) : (
        <Spinner className="u-width--auto" />
      )}
    </>
  );
};

export default NodeNameFields;
