import { useState } from "react";

import {
  MainTable,
  ContextualMenu,
  Row,
  Col,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import FormikForm from "app/base/components/FormikForm";
import domainURLs from "app/domains/urls";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";

const DomainsTable = (): JSX.Element => {
  const dispatch = useDispatch();
  const domains = useSelector(domainSelectors.all);
  const [expandedID, setExpandedID] = useState(-1);
  const headers = [
    {
      content: "Domain",
      sortKey: "name",
      "data-test": "domain-name-header",
    },
    {
      content: "Authoriatative",
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
      className: `p-table__row ${isActive ? "is-active" : ""}`,
      columns: [
        {
          content: (
            <Link to={domainURLs.details({ id: domain.id })}>
              {domain.is_default ? `${domain.name} (default)` : domain.name}
            </Link>
          ),
          "data-test": "domain-name",
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
              toggleClassName="u-no-margin--bottom"
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
        <ExpandedContent
          closeForm={() => {
            dispatch(domainActions.cleanup());
            setExpandedID(-1);
          }}
          id={domain.id}
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
      data-test="domains-table"
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

type ExpandedContentProps = {
  closeForm: () => void;
  id: number;
};

const ExpandedContent = ({
  closeForm,
  id,
}: ExpandedContentProps): JSX.Element => {
  const dispatch = useDispatch();

  const errors = useSelector(domainSelectors.errors);
  const saving = useSelector(domainSelectors.saving);
  const saved = useSelector(domainSelectors.saved);

  return (
    <Row>
      <Col size="12" className="u-align--right">
        <hr />
        <FormikForm
          initialValues={{}}
          buttonsAlign="right"
          buttonsBordered={false}
          errors={errors}
          onCancel={closeForm}
          onSubmit={() => {
            dispatch(domainActions.setDefault(id));
          }}
          onSuccess={closeForm}
          saved={saved}
          saving={saving}
          submitLabel={`Set default`}
        >
          <p className="u-no-max-width">
            Setting this domain as the default will update all existing machines
            (in Ready state) with the new default domain. Are you sure?
          </p>
        </FormikForm>
      </Col>
    </Row>
  );
};

export default DomainsTable;
