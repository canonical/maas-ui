import type { ReactElement } from "react";
import { useRef } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import { Link } from "@canonical/react-components";

import { Label } from "@/app/base/components/node/NodeLogs/EventLogs/EventLogs";
import useEventLogsTableColumns from "@/app/base/components/node/NodeLogs/EventLogs/EventLogsTable/useEventLogsTableColumns/useEventLogsTableColumns";
import type { EventRecord } from "@/app/store/event/types";

import "./index.scss";

type EventLogsTableProps = {
  events: EventRecord[];
  loading: boolean;
};

const EventLogsTable = ({
  events,
  loading,
}: EventLogsTableProps): ReactElement => {
  const tableRef = useRef<HTMLDivElement>(null);
  const columns = useEventLogsTableColumns();

  const showBackToTop = events.length >= 50;

  return (
    <div className="u-position--relative" ref={tableRef}>
      <GenericTable
        aria-label="Event logs table"
        className="event-logs-table"
        columns={columns}
        data={events}
        isLoading={loading}
        noData="No event logs available."
        variant="full-height"
      />
      {showBackToTop && (
        <div className="event-logs__back-to-top">
          <Link
            data-testid="backToTop"
            onClick={(event) => {
              event.preventDefault();
              const tableBody = tableRef.current?.querySelector("tbody");
              if (tableBody) {
                tableBody.scrollTop = 0;
              }
            }}
            top
          >
            {Label.BackToTop}
          </Link>
        </div>
      )}
    </div>
  );
};

export default EventLogsTable;
