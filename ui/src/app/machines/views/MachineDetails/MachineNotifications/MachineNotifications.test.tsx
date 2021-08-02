import { mount } from "enzyme";

import MachineNotifications from "./MachineNotifications";

describe("MachineNotifications", () => {
  it("can render", () => {
    const wrapper = mount(
      <MachineNotifications
        notifications={[
          {
            active: true,
            content:
              "Editing is currently disabled because no rack controller is currently connected to the region.",
            severity: "negative",
            title: "Error:",
          },
        ]}
      />
    );
    expect(wrapper.find("MachineNotifications")).toMatchSnapshot();
  });

  it("ignores inactive notifications", () => {
    const wrapper = mount(
      <MachineNotifications
        notifications={[
          {
            active: false,
            content: "Don't show me!",
            severity: "negative",
            title: "Error:",
          },
        ]}
      />
    );
    expect(wrapper.find("Notification").exists()).toBe(false);
  });
});
