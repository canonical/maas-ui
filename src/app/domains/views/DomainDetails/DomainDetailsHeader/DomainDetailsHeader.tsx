import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";

import SectionHeader from "app/base/components/SectionHeader";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import type { Domain } from "app/store/domain/types";
import { isDomainDetails } from "app/store/domain/utils";
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

type Props = {
  id: Domain["id"];
  setFormOpen: React.Dispatch<
    React.SetStateAction<"DeleteDomain" | "AddRecord" | null>
  >;
};

export enum Labels {
  AddRecord = "Add record",
  DeleteDomain = "Delete domain",
}

const DomainDetailsHeader = ({
  id,
  setFormOpen,
}: Props): JSX.Element | null => {
  const domain = useSelector((state: RootState) =>
    domainSelectors.getById(state, id)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(domainActions.get(id));
  }, [dispatch, id]);

  const isDefaultDomain = id === 0;
  const hostsCount = domain?.hosts ?? 0;
  const recordsCount = domain?.resource_count ?? 0;

  const buttons = [
    <Button
      data-testid="add-record"
      key="add-record"
      onClick={() => setFormOpen("AddRecord")}
    >
      {Labels.AddRecord}
    </Button>,
  ];
  if (!isDefaultDomain) {
    buttons.unshift(
      <Button
        appearance="negative"
        data-testid="delete-domain"
        key="delete-domain"
        onClick={() => setFormOpen("DeleteDomain")}
      >
        {Labels.DeleteDomain}
      </Button>
    );
  }

  return (
    <SectionHeader
      buttons={buttons}
      loading={!domain}
      subtitle={`${pluralizeString("host", hostsCount, "")}${
        hostsCount > 1 ? "; " : ""
      }${pluralizeString(
        "resource record",
        recordsCount,
        "No resource records"
      )}`}
      subtitleLoading={!isDomainDetails(domain)}
      title={domain?.name}
    />
  );
};

export default DomainDetailsHeader;
