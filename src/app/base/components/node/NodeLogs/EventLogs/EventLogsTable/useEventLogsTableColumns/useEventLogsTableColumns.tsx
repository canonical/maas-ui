import { useMemo } from "react";

import { Icon } from "@canonical/react-components";
import type { ColumnDef, Row } from "@tanstack/react-table";

import type { EventRecord } from "@/app/store/event/types";

type EventLogColumnDef = ColumnDef<EventRecord, Partial<EventRecord>>;

const useEventLogsTableColumns = (): EventLogColumnDef[] => {
  return useMemo(
    () =>
      [
        {
          id: "type",
          accessorKey: "type",
          header: "Event type",
          enableSorting: false,
          cell: ({
            row: {
              original: { type },
            },
          }: {
            row: Row<EventRecord>;
          }) => {
            let icon: string = type.level;
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
            return (
              <>
                <Icon name={icon} /> {type.level.toUpperCase()}
              </>
            );
          },
        },
        {
          id: "time",
          accessorKey: "created",
          header: "Time",
          enableSorting: false,
        },
        {
          id: "event",
          accessorKey: "description",
          header: "Event",
          enableSorting: false,
          cell: ({
            row: {
              original: { type, description },
            },
          }: {
            row: Row<EventRecord>;
          }) => [type.description, description].filter(Boolean).join(" - "),
        },
      ] as EventLogColumnDef[],
    []
  );
};

export default useEventLogsTableColumns;
