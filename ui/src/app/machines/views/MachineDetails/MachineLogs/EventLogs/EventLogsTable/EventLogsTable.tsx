import type { ReactNode } from "react";

import { Icon, MainTable, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import type { EventRecord } from "app/store/event/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = {
  events: EventRecord[];
  systemId: Machine["system_id"];
};

type EventRow = {
  className?: string | null;
  columns: { className?: string; content: ReactNode }[];
  key: EventRecord["id"];
};

const generateRow = (event: EventRecord): EventRow => {
  let icon: string = event.type.level;
  switch (icon) {
    case "audit":
    case "info":
      icon = "information";
      break;
    case "critical":
      icon = "error";
      break;
    case "debug":
      icon = "inspector-debug";
      break;
  }
  return {
    columns: [
      {
        className: "time-col",
        content: (
          <>
            <Icon name={icon} /> {event.created}
          </>
        ),
      },
      {
        className: "event-col",
        content: [event.type?.description, event.description]
          .filter(Boolean)
          .join(" - "),
      },
    ],
    key: event.id,
  };
};

const EventLogsTable = ({ events, systemId }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  if (!machine) {
    return <Spinner text="Loading..." />;
  }
  const rows = events?.map((event) => generateRow(event));

  return (
    <MainTable
      className="event-logs-table"
      headers={[
        {
          content: "Time",
          className: "time-col",
        },
        {
          content: "Event",
          className: "event-col",
        },
      ]}
      rows={rows}
    />
  );
};

export default EventLogsTable;
