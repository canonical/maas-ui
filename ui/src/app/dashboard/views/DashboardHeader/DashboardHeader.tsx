import { useEffect, useState } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import ClearAllForm from "./ClearAllForm";

import SectionHeader from "app/base/components/SectionHeader";
import dashboardURLs from "app/dashboard/urls";
import { actions as discoveryActions } from "app/store/discovery";
import discoverySelectors from "app/store/discovery/selectors";

const DashboardHeader = (): JSX.Element => {
  const location = useLocation();
  const dispatch = useDispatch();
  const discoveries = useSelector(discoverySelectors.all);
  const [isFormOpen, setFormOpen] = useState(false);

  useEffect(() => {
    dispatch(discoveryActions.fetch());
  }, [dispatch]);

  let buttons: JSX.Element[] | null = [
    <Button
      appearance="neutral"
      data-testid="clear-all"
      disabled={discoveries.length === 0}
      key="clear-all"
      onClick={() => setFormOpen(true)}
    >
      Clear all discoveries
    </Button>,
  ];
  let headerContent: JSX.Element | null = null;
  if (isFormOpen) {
    buttons = null;
    headerContent = (
      <ClearAllForm
        closeForm={() => {
          setFormOpen(false);
        }}
      />
    );
  }

  return (
    <SectionHeader
      buttons={buttons}
      headerContent={headerContent}
      title="Network discovery"
      tabLinks={[
        {
          active: location.pathname === dashboardURLs.index,
          component: Link,
          label: pluralize("discovery", discoveries.length, true),
          to: dashboardURLs.index,
        },
        {
          active: location.pathname === dashboardURLs.configuration,
          component: Link,
          label: "Configuration",
          to: dashboardURLs.configuration,
        },
      ]}
    />
  );
};

export default DashboardHeader;
