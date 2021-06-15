import { useEffect, useState } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import SectionHeader from "app/base/components/SectionHeader";
import type { RouteParams } from "app/base/types";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import type { RootState } from "app/store/root/types";

const pluralizeString = (
  prefix: string,
  count: number,
  emptyMessage: string
) => {
  if (count < 1) {
    return emptyMessage;
  }
  return `${pluralize(prefix, count, true)}`;
};

const DomainDetailsHeader = (): JSX.Element => {
  const { id } = useParams<RouteParams>();
  const domain = useSelector((state: RootState) =>
    domainSelectors.getById(state, Number(id))
  );
  const dispatch = useDispatch();
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const hostsCount = domain?.hosts ?? 0;
  const recordsCount = domain?.resource_count ?? 0;

  const [isDeleteFormOpen, setDeleteFormOpen] = useState(false);
  const [isRecordFormOpen, setRecordFormOpen] = useState(false);

  useEffect(() => {
    dispatch(domainActions.fetch());
  }, [dispatch]);

  let buttons: JSX.Element[] | null = [
    <Button
      appearance="negative"
      data-test="delete-domain"
      key="delete-domain"
      onClick={() => setDeleteFormOpen(true)}
    >
      Delete domain
    </Button>,
    <Button
      appearance="neutral"
      data-test="add-record"
      key="add-record"
      onClick={() => setRecordFormOpen(true)}
    >
      Add record
    </Button>,
  ];

  let formWrapper: JSX.Element | null = null;

  if (isDeleteFormOpen) {
    buttons = null;
    formWrapper = <h1>Delete form goes here</h1>;
  } else if (isRecordFormOpen) {
    buttons = null;
    formWrapper = <h1>Add record form goes here</h1>;
  }
  return (
    <SectionHeader
      buttons={buttons}
      loading={!domainsLoaded}
      subtitle={`${pluralizeString("host", hostsCount, "")}${
        hostsCount > 1 ? "; " : ""
      }${pluralizeString(
        "resource record",
        recordsCount,
        "No resource records"
      )}`}
      title={domain?.name}
      formWrapper={formWrapper}
    />
  );
};

export default DomainDetailsHeader;
