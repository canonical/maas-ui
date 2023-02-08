import React, { useEffect, useCallback } from "react";

import { ContextualMenu } from "@canonical/react-components";
import { useNavigate } from "react-router-dom-v5-compat";

import SubnetsTable from "./SubnetsTable";
import { SubnetsColumns } from "./SubnetsTable/constants";
import type { GroupByKey } from "./SubnetsTable/types";

import MainContentSection from "app/base/components/MainContentSection";
import SectionHeader from "app/base/components/SectionHeader";
import SegmentedControl from "app/base/components/SegmentedControl";
import { useWindowTitle } from "app/base/hooks";
import { useQuery } from "app/base/hooks/urls";
import { SubnetForms, SubnetsUrlParams } from "app/subnets/enum";
import type { SubnetForm } from "app/subnets/types";
import FormActions from "app/subnets/views/FormActions";

const SubnetsList = (): JSX.Element => {
  useWindowTitle("Subnets");
  const [activeForm, setActiveForm] = React.useState<SubnetForm | null>(null);
  const query = useQuery();
  const navigate = useNavigate();
  const groupBy = query.get(SubnetsUrlParams.By);
  const searchText = query.get(SubnetsUrlParams.Q) || "";
  const setGroupBy = useCallback(
    (group: GroupByKey) =>
      navigate(
        {
          pathname: "/networks",
          search: `?${SubnetsUrlParams.By}=${group}&${SubnetsUrlParams.Q}=${searchText}`,
        },
        { replace: true }
      ),
    [navigate, searchText]
  );
  const setSearchText = useCallback(
    (searchText) =>
      navigate(
        {
          pathname: "/networks",
          search: `?${SubnetsUrlParams.By}=${groupBy}&${SubnetsUrlParams.Q}=${searchText}`,
        },
        { replace: true }
      ),
    [navigate, groupBy]
  );

  const hasValidGroupBy = groupBy && ["fabric", "space"].includes(groupBy);

  useEffect(() => {
    if (!hasValidGroupBy) {
      setGroupBy("fabric");
    }
  }, [groupBy, setGroupBy, hasValidGroupBy]);

  return (
    <MainContentSection
      header={
        <SectionHeader
          buttons={[
            <ContextualMenu
              hasToggleIcon
              links={[
                SubnetForms.Fabric,
                SubnetForms.VLAN,
                SubnetForms.Space,
                SubnetForms.Subnet,
              ].map((children) => ({
                children,
                onClick: () => setActiveForm(children),
              }))}
              position="right"
              toggleAppearance="positive"
              toggleLabel="Add"
            />,
          ]}
          sidePanelContent={
            activeForm ? (
              <FormActions
                activeForm={activeForm}
                setActiveForm={setActiveForm}
              />
            ) : null
          }
          sidePanelTitle={activeForm ? `Add ${activeForm}` : ""}
          subtitle={
            <div className="u-flex--wrap u-flex--align-center u-nudge-right">
              <SegmentedControl
                aria-label="Group by"
                buttonClassName="u-no-margin--bottom u-upper-case--first"
                onSelect={setGroupBy}
                options={[
                  {
                    label: "Fabric",
                    value: SubnetsColumns.FABRIC,
                  },
                  {
                    label: "Space",
                    value: SubnetsColumns.SPACE,
                  },
                ]}
                selected={groupBy as GroupByKey}
              />
            </div>
          }
          title="Subnets"
        />
      }
    >
      {hasValidGroupBy ? (
        <SubnetsTable
          groupBy={groupBy as GroupByKey}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      ) : null}
    </MainContentSection>
  );
};

export default SubnetsList;
