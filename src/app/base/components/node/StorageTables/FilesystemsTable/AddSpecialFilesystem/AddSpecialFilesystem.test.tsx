import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AddSpecialFilesystem from "./AddSpecialFilesystem";

import { actions as machineActions } from "app/store/machine";
import {
  machineDetails as machineDetailsFactory,
  machineEventError as machineEventErrorFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("only shows filesystems that do not require a storage device", () => {
  const machine = machineDetailsFactory({
    supported_filesystems: [
      { key: "fat32", ui: "fat32" }, // requires storage
      { key: "ramfs", ui: "ramfs" }, // does not require storage
    ],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
      statuses: machineStatusesFactory({
        [machine.system_id]: machineStatusFactory(),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <AddSpecialFilesystem closeForm={jest.fn()} machine={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("option", { name: "ramfs" })).toBeInTheDocument();
  expect(
    screen.queryByRole("option", { name: "fat32" })
  ).not.toBeInTheDocument();
});

it("can show errors", () => {
  const machine = machineDetailsFactory({ system_id: "abc123" });
  const state = rootStateFactory({
    machine: machineStateFactory({
      eventErrors: [
        machineEventErrorFactory({
          error: "you can't do that",
          event: "mountSpecial",
          id: machine.system_id,
        }),
      ],
      items: [machine],
      statuses: machineStatusesFactory({
        [machine.system_id]: machineStatusFactory(),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <AddSpecialFilesystem closeForm={jest.fn()} machine={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("you can't do that")).toBeInTheDocument();
});

it("correctly dispatches an action to mount a special filesystem", async () => {
  const machine = machineDetailsFactory({
    supported_filesystems: [{ key: "ramfs", ui: "ramfs" }],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
      statuses: machineStatusesFactory({
        [machine.system_id]: machineStatusFactory(),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <AddSpecialFilesystem closeForm={jest.fn()} machine={machine} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Type" }),
    "ramfs"
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: "Mount point" }),
    "/abc"
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: "Mount options" }),
    "qwerty"
  );
  await userEvent.click(screen.getByRole("button", { name: "Mount" }));

  await waitFor(() => {
    const expectedAction = machineActions.mountSpecial({
      fstype: "ramfs",
      mountOptions: "qwerty",
      mountPoint: "/abc",
      systemId: machine.system_id,
    });
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
