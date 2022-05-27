import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import StorageForm from "../StorageForm";

import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("StorageFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        loaded: true,
        items: [
          {
            name: "default_storage_layout",
            value: "bcache",
            choices: [
              ["bcache", "Bcache layout"],
              ["blank", "No storage (blank) layout"],
              ["flat", "Flat layout"],
              ["lvm", "LVM layout"],
              ["vmfs6", "VMFS6 layout"],
            ],
          },
          {
            name: "enable_disk_erasing_on_release",
            value: false,
          },
          {
            name: "disk_erase_with_secure_erase",
            value: false,
          },
          {
            name: "disk_erase_with_quick_erase",
            value: false,
          },
        ],
      }),
    });
  });

  it("displays a warning if blank storage layout chosen", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <StorageForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("select[name='default_storage_layout']").simulate("change", {
      target: { name: "default_storage_layout", value: "blank" },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find(".p-form-validation__message").text()).toBe(
      "Caution: You will not be able to deploy machines with this storage layout. Manual configuration is required."
    );
  });

  it("displays a warning if a VMFS storage layout chosen", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <StorageForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("select[name='default_storage_layout']").simulate("change", {
      target: { name: "default_storage_layout", value: "vmfs6" },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find(".p-form-validation__message").text()).toBe(
      "Caution: This storage layout only allows for the deployment of VMware (ESXi) images."
    );
  });
});
