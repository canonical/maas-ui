import { mount } from "enzyme";

import DeviceHeaderForms from "./DeviceHeaderForms";

import { DeviceHeaderViews } from "app/devices/constants";

describe("DeviceHeaderForms", () => {
  it("can render the Add Device form", () => {
    const wrapper = mount(
      <DeviceHeaderForms
        headerContent={{ view: DeviceHeaderViews.ADD_DEVICE }}
        setHeaderContent={jest.fn()}
      />
    );

    expect(wrapper.find("AddDeviceForm").exists()).toBe(true);
  });
});
