import type { ReactElement } from "react";

import { ContextualMenu } from "@canonical/react-components";
import { Link, useLocation } from "react-router";

import { useGroupStatistics } from "@/app/api/query/groups";
import type { UserGroupResponse } from "@/app/apiclient";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/settings/urls";
import AddEntitlement from "@/app/settings/views/UserManagement/views/Groups/components/AddEntitlement";
import DeleteGroup from "@/app/settings/views/UserManagement/views/Groups/components/DeleteGroup";
import EditGroup from "@/app/settings/views/UserManagement/views/Groups/components/EditGroup";

type GroupDetailsHeaderProps = {
  group: UserGroupResponse | undefined;
  loading: boolean;
};

const GroupDetailsHeader = ({
  group,
  loading,
}: GroupDetailsHeaderProps): ReactElement => {
  const { openSidePanel } = useSidePanel();
  const { pathname } = useLocation();

  const { data: statistics, isLoading: statisticsLoading } = useGroupStatistics(
    { query: { id: group?.id ? [group.id] : [] } },
    !!group?.id
  );

  const urlBase = `/settings/user-management/group/${group?.id}`;

  return (
    <SectionHeader
      buttons={[
        <ContextualMenu
          hasToggleIcon
          links={[
            [
              {
                children: "Add entitlement...",
                onClick: () => {
                  openSidePanel({
                    component: AddEntitlement,
                    title: "Add entitlement",
                    props: {
                      group_id: group!.id,
                    },
                  });
                },
              },
              {
                children: "Add member...",
                onClick: () => {
                  openSidePanel({
                    component: EditGroup,
                    title: "Add member",
                    props: {
                      id: group!.id,
                    },
                  });
                },
              },
            ],
            [
              {
                children: "Edit...",
                onClick: () => {
                  openSidePanel({
                    component: EditGroup,
                    title: "Edit group",
                    props: {
                      id: group!.id,
                    },
                  });
                },
              },
              {
                children: "Delete...",
                onClick: () => {
                  openSidePanel({
                    component: DeleteGroup,
                    title: "Delete group",
                    props: {
                      id: group!.id,
                      user_count: statistics?.items[0]?.user_count ?? 0,
                    },
                  });
                },
              },
            ],
          ]}
          position="right"
          toggleAppearance="positive"
          toggleLabel="Take action"
        />,
      ]}
      loading={loading || statisticsLoading}
      tabLinks={[
        {
          active: pathname.startsWith(`${urlBase}/entitlements`),
          component: Link,
          label: "Entitlements",
          to: `${urlBase}/entitlements`,
        },
        {
          active: pathname.startsWith(`${urlBase}/members`),
          component: Link,
          label: "Members",
          to: `${urlBase}/members`,
        },
      ]}
      title={
        <>
          {group ? group.name : "Group"}
          <Link
            className="u-nudge-right"
            style={{ fontSize: "1rem" }}
            to={urls.userManagement.groups}
          >
            &lsaquo; Back to all groups
          </Link>
        </>
      }
    />
  );
};

export default GroupDetailsHeader;
