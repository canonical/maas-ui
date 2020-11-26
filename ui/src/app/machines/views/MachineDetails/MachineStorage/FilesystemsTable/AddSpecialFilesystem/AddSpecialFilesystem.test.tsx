import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import AddSpecialFilesystem from "./AddSpecialFilesystem";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddSpecialFilesystem", () => {
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
      filesystemType: "tmpfs",
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
