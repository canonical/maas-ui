import { useEffect, useCallback } from "react";

import { ContextualMenu } from "@canonical/react-components";
import { useNavigate } from "react-router-dom-v5-compat";

import SubnetsTable from "./SubnetsTable";
import { SubnetsColumns } from "./SubnetsTable/constants";
import type { GroupByKey } from "./SubnetsTable/types";

import PageContent from "@/app/base/components/PageContent/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import SegmentedControl from "@/app/base/components/SegmentedControl";
import { useWindowTitle } from "@/app/base/hooks";
import { useQuery } from "@/app/base/hooks/urls";
import { useSidePanel } from "@/app/base/side-panel-context";
import { SubnetForms, SubnetsUrlParams } from "@/app/subnets/constants";
import { SubnetSidePanelViews } from "@/app/subnets/types";
import FormActions from "@/app/subnets/views/FormActions";

const SubnetsList = (): JSX.Element => {
  useWindowTitle("Subnets");
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
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
    (searchText: string) =>
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

  const [, name] = sidePanelContent?.view || [];
  const activeForm =
    name && Object.keys(SubnetForms).includes(name)
      ? SubnetForms[name as keyof typeof SubnetForms]
      : null;

  return (
    <PageContent
      header={
        <SectionHeader
          buttons={[
            <ContextualMenu
              hasToggleIcon
              links={[
                SubnetSidePanelViews.Fabric,
                SubnetSidePanelViews.VLAN,
                SubnetSidePanelViews.Space,
                SubnetSidePanelViews.Subnet,
              ].map((view) => {
                const [, name] = view;
                return {
                  children: name,
                  onClick: () => setSidePanelContent({ view }),
                };
              })}
              position="right"
              toggleAppearance="positive"
              toggleLabel="Add"
            />,
          ]}
          subtitle={
            <div className="u-flex--wrap u-flex--align-center">
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
      sidePanelContent={
        activeForm ? (
          <FormActions
            activeForm={activeForm}
            setActiveForm={setSidePanelContent}
          />
        ) : null
      }
      sidePanelTitle={activeForm ? `Add ${activeForm}` : ""}
    >
      {hasValidGroupBy ? (
        <SubnetsTable
          groupBy={groupBy as GroupByKey}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      ) : null}
    </PageContent>
  );
};

export default SubnetsList;
