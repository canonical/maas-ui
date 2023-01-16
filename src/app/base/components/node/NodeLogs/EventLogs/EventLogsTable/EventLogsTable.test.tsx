import EventLogsTable, { Label } from "./EventLogsTable";

import type { RootState } from "app/store/root/types";
import {
  eventRecord as eventRecordFactory,
  eventState as eventStateFactory,
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithMockStore } from "testing/utils";

describe("EventLogsTable", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      event: eventStateFactory({
        items: [
          eventRecordFactory({ id: 101, node_id: 1 }),
          eventRecordFactory({ id: 123, node_id: 2 }),
        ],
      }),
      machine: machineStateFactory({
        items: [machineDetailsFactory({ id: 1, system_id: "abc123" })],
      }),
    });
  });

  it("can display a table", () => {
    renderWithMockStore(<EventLogsTable events={state.event.items} />, {
      state,
    });
    expect(screen.getByLabelText(Label.Title)).toBeInTheDocument();
  });
});
