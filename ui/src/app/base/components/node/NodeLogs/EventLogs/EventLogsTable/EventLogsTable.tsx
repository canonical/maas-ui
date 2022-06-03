import type { ReactNode } from "react";

import { Icon, MainTable } from "@canonical/react-components";

import type { EventRecord } from "app/store/event/types";

type Props = {
  events: EventRecord[];
};

type EventRow = {
  className?: string | null;
  columns: { className?: string; content: ReactNode }[];
  key: EventRecord["id"];
};

export enum Label {
  Title = "Event logs table",
}

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
        content: [event.type.description, event.description]
          .filter(Boolean)
          .join(" - "),
      },
    ],
    key: event.id,
  };
};

const EventLogsTable = ({ events }: Props): JSX.Element => {
  const rows = events?.map((event) => generateRow(event));

  return (
    <MainTable
      aria-label={Label.Title}
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
