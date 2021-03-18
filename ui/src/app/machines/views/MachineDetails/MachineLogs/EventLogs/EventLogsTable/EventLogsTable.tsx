import type { ReactNode } from "react";

import { Icon, MainTable, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import eventSelectors from "app/store/event/selectors";
import type { EventRecord } from "app/store/event/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = { systemId: Machine["system_id"] };

type NetworkRow = {
  className?: string | null;
  columns: { className?: string; content: ReactNode }[];
  key: EventRecord["id"];
};

const generateRow = (event: EventRecord): NetworkRow => {
  return {
    columns: [
      {
        className: "time-col",
        content: (
          <>
            <Icon name={event.type.level} /> {event.created}
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

const EventLogsTable = ({ systemId }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const events = useSelector((state: RootState) =>
    eventSelectors.getByNodeId(state, machine?.id)
  );
  if (!machine || !events) {
    return <Spinner text="Loading..." />;
  }

  const rows = events
    .sort(
      (a: EventRecord, b: EventRecord) =>
        new Date(b.created).getTime() - new Date(a.created).getTime()
    )
    .map((event) => generateRow(event));

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
