import { useState } from "react";

import { MainTable, ContextualMenu } from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TableConfirm from "app/base/components/TableConfirm";
import domainURLs from "app/domains/urls";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import type { Domain, DomainMeta } from "app/store/domain/types";

const DomainsTable = (): JSX.Element => {
  const dispatch = useDispatch();
  const domains = useSelector(domainSelectors.all);
  const errors = useSelector(domainSelectors.errors);
  const saving = useSelector(domainSelectors.saving);
  const saved = useSelector(domainSelectors.saved);
  const [expandedID, setExpandedID] = useState<Domain[DomainMeta.PK] | null>();
  const headers = [
    {
      content: "Domain",
      sortKey: "name",
      "data-testid": "domain-name-header",
    },
    {
      content: "Authoritative",
      sortKey: "authoritative",
    },
    {
      content: "Hosts",
      sortKey: "hosts",
      className: "u-align--right",
    },
    {
      content: "Total records",
      sortKey: "records",
      className: "u-align--right",
    },
    {
      content: "Actions",
      className: "u-align--right",
    },
  ];

  const rows = domains.map((domain) => {
    const isActive = expandedID === domain.id;
    return {
      // making sure we don't pass id directly as a key because of
      // https://github.com/canonical-web-and-design/react-components/issues/476
      key: `domain-row-${domain.id}`,
      className: classNames("p-table__row", { "is-active": isActive }),
      columns: [
        {
          content: (
            <Link to={domainURLs.details({ id: domain.id })}>
              {domain.is_default ? `${domain.name} (default)` : domain.name}
            </Link>
          ),
          "data-testid": "domain-name",
        },
        {
          content: domain.authoritative ? "Yes" : "No",
        },
        {
          content: domain.hosts,
          className: "u-align--right",
        },
        {
          content: domain.resource_count,
          className: "u-align--right",
        },
        {
          content: (
            <ContextualMenu
              hasToggleIcon={true}
              toggleDisabled={domain.is_default}
              toggleAppearance="base"
              toggleClassName="u-no-margin--bottom is-small is-dense"
              links={[
                {
                  children: "Set default...",
                  onClick: () => {
                    dispatch(domainActions.cleanup());
                    setExpandedID(domain.id);
                  },
                },
              ]}
            />
          ),
          className: "u-align--right",
        },
      ],
      expanded: isActive,
      expandedContent: (
        <TableConfirm
          confirmAppearance="positive"
          confirmLabel="Set default"
          errors={errors}
          errorKey="domain"
          finished={saved}
          inProgress={saving}
          message={
            <>
              Setting this domain as the default will update all existing
              machines (in Ready state) with the new default domain. Are you
              sure?
            </>
          }
          onClose={() => {
            dispatch(domainActions.cleanup());
            setExpandedID(null);
          }}
          onConfirm={() => {
            dispatch(domainActions.setDefault(domain.id));
          }}
          sidebar={false}
        />
      ),
      sortData: {
        name: domain.name,
        authoritative: domain.authoritative,
        hosts: domain.hosts,
        records: domain.resource_count,
      },
    };
  });

  return (
    <MainTable
      className="p-table-expanding--light"
      data-testid="domains-table"
      headers={headers}
      rows={rows}
      paginate={50}
      sortable
      defaultSort="name"
      defaultSortDirection="ascending"
      expanding={true}
    />
  );
};

export default DomainsTable;
