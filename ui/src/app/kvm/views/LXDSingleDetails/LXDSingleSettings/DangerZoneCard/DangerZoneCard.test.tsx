import { mount } from "enzyme";

import DangerZoneCard from "./DangerZoneCard";

import { KVMHeaderViews } from "app/kvm/constants";

describe("DangerZoneCard", () => {
  it("can open the delete KVM form", () => {
    const setHeaderContent = jest.fn();
    const wrapper = mount(
      <DangerZoneCard hostId={1} setHeaderContent={setHeaderContent} />
    );

    wrapper.find("button[data-test='remove-kvm']").simulate("click");
    expect(setHeaderContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.DELETE_KVM,
      extras: {
        hostId: 1,
      },
    });
  });
});
