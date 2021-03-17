import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import AddSpecialFilesystem from "./AddSpecialFilesystem";

import {
  machineDetails as machineDetailsFactory,
  machineEventError as machineEventErrorFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddSpecialFilesystem", () => {
  it("only shows filesystems that do not require a storage device", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            supported_filesystems: [
              { key: "fat32", ui: "fat32" }, // requires storage
              { key: "ramfs", ui: "ramfs" }, // does not require storage
            ],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AddSpecialFilesystem closeForm={jest.fn()} systemId="abc123" />
      </Provider>
    );

    expect(
      wrapper.find("FormikField[name='fstype'] option[value='fat32']").exists()
    ).toBe(false);
    expect(
      wrapper.find("FormikField[name='fstype'] option[value='ramfs']").exists()
    ).toBe(true);
  });

  it("can show errors", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: [
          machineEventErrorFactory({
            error: "you can't do that",
            event: "mountSpecial",
            id: "abc123",
          }),
        ],
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AddSpecialFilesystem closeForm={jest.fn()} systemId="abc123" />
      </Provider>
    );

    expect(
      wrapper.find("Notification").text().includes("you can't do that")
    ).toBe(true);
  });

  it("correctly dispatches an action to mount a special filesystem", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AddSpecialFilesystem closeForm={jest.fn()} systemId="abc123" />
      </Provider>
    );

    wrapper.find("Formik").prop("onSubmit")({
      fstype: "tmpfs",
      mountOptions: "noexec,size=1024k",
      mountPoint: "/path/to/filesystem",
    });

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/mountSpecial")
    ).toStrictEqual({
      meta: {
        method: "mount_special",
        model: "machine",
      },
      payload: {
        params: {
          fstype: "tmpfs",
          mount_options: "noexec,size=1024k",
          mount_point: "/path/to/filesystem",
          system_id: "abc123",
        },
      },
      type: "machine/mountSpecial",
    });
  });
});
