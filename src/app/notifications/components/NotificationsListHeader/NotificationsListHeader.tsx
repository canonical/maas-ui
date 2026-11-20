import { MainToolbar } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";

import DeleteAllNotifications from "../DeleteAllNotifications";

import SegmentedControl from "@/app/base/components/SegmentedControl";
import { useModal } from "@/app/base/modal-context";
import { NotificationSeverityFilter } from "@/app/notifications/constants";

export enum Label {
  Header = "Notifications header",
  DeleteAllButton = "Delete all",
  All = "All",
  Success = "Success",
  Info = "Info",
  Warning = "Warning",
  Error = "Error",
}

type Props = {
  filter: NotificationSeverityFilter;
  setFilter: (filter: NotificationSeverityFilter) => void;
};

const NotificationsListHeader = ({
  filter,
  setFilter,
}: Props): React.ReactElement => {
  const { openModal } = useModal();

  return (
    <MainToolbar>
      <MainToolbar.Title>Notifications</MainToolbar.Title>
      <MainToolbar.Controls>
        <SegmentedControl
          aria-label="notification severity filter"
          onSelect={setFilter}
          options={[
            { label: Label.All, value: NotificationSeverityFilter.All },
            {
              label: Label.Success,
              value: NotificationSeverityFilter.Success,
            },
            { label: Label.Info, value: NotificationSeverityFilter.Info },
            {
              label: Label.Warning,
              value: NotificationSeverityFilter.Warning,
            },
            { label: Label.Error, value: NotificationSeverityFilter.Error },
          ]}
          selected={filter}
        />
        <Button
          appearance="negative"
          onClick={() => {
            openModal({
              component: DeleteAllNotifications,
              title: "Delete all notifications",
            });
          }}
        >
          {Label.DeleteAllButton}
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default NotificationsListHeader;
