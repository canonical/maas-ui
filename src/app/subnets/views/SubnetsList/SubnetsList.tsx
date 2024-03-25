import { useEffect, useCallback } from "react";

import { MainToolbar } from "@canonical/maas-react-components";
import { ContextualMenu } from "@canonical/react-components";
import { useNavigate } from "react-router-dom";

import SubnetsControls from "./SubnetsControls";
import SubnetsTable from "./SubnetsTable";
import type { GroupByKey } from "./SubnetsTable/types";

import GroupSelect from "@/app/base/components/GroupSelect";
import PageContent from "@/app/base/components/PageContent/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { useQuery } from "@/app/base/hooks/urls";
import { useSidePanel } from "@/app/base/side-panel-context";
import {
  SubnetForms,
  SubnetsUrlParams,
  subnetGroupingOptions,
} from "@/app/subnets/constants";
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
    (group: GroupByKey | null) =>
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
        <MainToolbar>
          <MainToolbar.Title>Subnets</MainToolbar.Title>
          <MainToolbar.Controls>
            <SubnetsControls
              groupBy={groupBy as GroupByKey}
              handleSearch={setSearchText}
              searchText={searchText}
            />
            <GroupSelect
              className="subnet-group__select"
              groupOptions={subnetGroupingOptions}
              grouping={groupBy as GroupByKey}
              name="network-groupings"
              setGrouping={setGroupBy}
            />
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
            />
          </MainToolbar.Controls>
        </MainToolbar>
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
        <SubnetsTable groupBy={groupBy as GroupByKey} searchText={searchText} />
      ) : null}
    </PageContent>
  );
};

export default SubnetsList;
