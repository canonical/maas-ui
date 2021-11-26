import { Select, Spinner } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { FormValues } from "../NodeName";

import FormikField from "app/base/components/FormikField";
import domainSelectors from "app/store/domain/selectors";

type Props = {
  saving?: boolean;
};

export const NodeNameFields = ({ saving }: Props): JSX.Element => {
  const domains = useSelector(domainSelectors.all);
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
          wrapperClassName="u-nudge-left u-no-margin--right"
        />
      ) : (
        <Spinner className="u-width--auto" />
      )}
    </>
  );
};

export default NodeNameFields;
