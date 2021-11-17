import { mount } from "enzyme";

import DangerZoneCard from "./DangerZoneCard";

import { KVMHeaderViews } from "app/kvm/constants";

describe("DangerZoneCard", () => {
  it("can open the delete KVM form", () => {
    const setHeaderContent = jest.fn();
    const wrapper = mount(
      <DangerZoneCard
        hostId={1}
        message="Delete KVM"
        setHeaderContent={setHeaderContent}
      />
    );

    wrapper.find("button[data-testid='remove-kvm']").simulate("click");
    expect(setHeaderContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.DELETE_KVM,
      extras: {
        hostId: 1,
      },
    });
  });

  it("can display message", () => {
    const setHeaderContent = jest.fn();
    const wrapper = mount(
      <DangerZoneCard
        hostId={1}
        message={<span data-testid="message">Delete KVM</span>}
        setHeaderContent={setHeaderContent}
      />
    );
    expect(wrapper.find("[data-testid='message']").exists()).toBe(true);
  });
});
