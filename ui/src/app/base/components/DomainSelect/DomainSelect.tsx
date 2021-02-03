import { useEffect } from "react";
import type { HTMLProps } from "react";

import { Select } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import type { Domain } from "app/store/domain/types";

type Props = {
  disabled?: boolean;
  label?: string;
  name: string;
  valueKey?: keyof Domain;
} & HTMLProps<HTMLSelectElement>;

export const DomainSelect = ({
  disabled = false,
  label = "Domain",
  name,
  valueKey = "name",
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const domains = useSelector(domainSelectors.all);
  const domainsLoaded = useSelector(domainSelectors.loaded);

  useEffect(() => {
    dispatch(domainActions.fetch());
  }, [dispatch]);

  return (
    <FormikField
      component={Select}
      disabled={!domainsLoaded || disabled}
      label={label}
      name={name}
      options={[
        { label: "Select domain", value: "", disabled: true },
        ...domains.map((domain) => ({
          key: `domain-${domain.id}`,
          label: domain.name,
          value: domain[valueKey],
        })),
      ]}
      {...props}
    />
  );
};

export default DomainSelect;
