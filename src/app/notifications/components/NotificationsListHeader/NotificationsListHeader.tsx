import { MainToolbar } from "@canonical/maas-react-components";
import { Icon } from "@canonical/react-components";

import DeleteAllNotifications from "../DeleteAllNotifications";

import Button from "@/app/base/components/Button";
import SegmentedControl from "@/app/base/components/SegmentedControl";
import { useModal } from "@/app/base/modal-context";
import {
  NOTIFICATION_CATEGORY_ICONS,
  NotificationSeverityFilter,
} from "@/app/notifications/constants";

export enum Label {
  Header = "Notifications header",
  DeleteAllButton = "Delete all",
  All = "All",
  Success = "Success",
  Info = "Info",
  Warning = "Warning",
  Error = "Error",
}

const categoryLabel = (
  category: NotificationSeverityFilter,
  label: string
): React.ReactElement => (
  <>
    <Icon name={NOTIFICATION_CATEGORY_ICONS[category]} />
    <span>{label}</span>
  </>
);

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
              label: categoryLabel(
                NotificationSeverityFilter.Success,
                Label.Success
              ),
              value: NotificationSeverityFilter.Success,
            },
            {
              label: categoryLabel(NotificationSeverityFilter.Info, Label.Info),
              value: NotificationSeverityFilter.Info,
            },
            {
              label: categoryLabel(
                NotificationSeverityFilter.Warning,
                Label.Warning
              ),
              value: NotificationSeverityFilter.Warning,
            },
            {
              label: categoryLabel(
                NotificationSeverityFilter.Error,
                Label.Error
              ),
              value: NotificationSeverityFilter.Error,
            },
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
