import type { Mock } from "vitest";

import EventLogsTable from "./EventLogsTable";

import { Label } from "@/app/base/components/node/NodeLogs/EventLogs/EventLogs";
import type { EventRecord } from "@/app/store/event/types";
import * as factory from "@/testing/factories";
import {
  screen,
  renderWithProviders,
  waitFor,
  userEvent,
  within,
} from "@/testing/utils";

describe("EventLogsTable", () => {
  let scrollToSpy: Mock;

  beforeEach(() => {
    scrollToSpy = vi.fn();
    global.scrollTo = scrollToSpy;
  });

  describe("display", () => {
    it.skip("displays a loading component if pools are loading", async () => {
      renderWithProviders(<EventLogsTable events={[]} loading={true} />);

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    it("displays a message when rendering an empty list", async () => {
      renderWithProviders(<EventLogsTable events={[]} loading={false} />);

      await waitFor(() => {
        expect(
          screen.getByText("No event logs available.")
        ).toBeInTheDocument();
      });
    });

    it("displays the columns correctly", () => {
      renderWithProviders(
        <EventLogsTable
          events={[
            factory.eventRecord({ id: 101, node_id: 1 }),
            factory.eventRecord({ id: 123, node_id: 2 }),
          ]}
          loading={false}
        />
      );

      ["Event type", "Time", "Event"].forEach((column) => {
        expect(
          screen.getByRole("columnheader", {
            name: new RegExp(`^${column}$`, "i"),
          })
        ).toBeInTheDocument();
      });
    });

    describe("action", () => {
      it("does not display the scroll-to-top component if there are less than 50 items", async () => {
        const events: EventRecord[] = [];
        for (let i = 0; i < 5; i++) {
          events.push(
            factory.eventRecord({
              node_id: 1,
              created: factory.timestamp("Tue, 16 Mar. 2021 03:04:00"),
            })
          );
        }

        renderWithProviders(<EventLogsTable events={events} loading={false} />);

        expect(
          screen.queryByRole("link", { name: Label.BackToTop })
        ).not.toBeInTheDocument();
      });

      it("scrolls the table to the top when scroll-to-top is clicked", async () => {
        const events: EventRecord[] = [];
        for (let i = 0; i < 50; i++) {
          events.push(
            factory.eventRecord({
              node_id: 1,
              created: factory.timestamp("Tue, 16 Mar. 2021 03:04:00"),
            })
          );
        }

        renderWithProviders(<EventLogsTable events={events} loading={false} />);

        expect(
          screen.getByRole("link", { name: Label.BackToTop })
        ).toBeInTheDocument();

        const tableBody = within(
          screen.getByRole("treegrid", { name: "Event logs table" })
        ).getAllByRole("rowgroup")[1];
        tableBody.scrollTop = 100;
        const initialHash = window.location.hash;

        await userEvent.click(
          screen.getByRole("link", { name: Label.BackToTop })
        );

        expect(tableBody.scrollTop).toBe(0);
        expect(scrollToSpy).not.toHaveBeenCalled();
        expect(window.location.hash).toBe(initialHash);
      });
    });
  });
});
