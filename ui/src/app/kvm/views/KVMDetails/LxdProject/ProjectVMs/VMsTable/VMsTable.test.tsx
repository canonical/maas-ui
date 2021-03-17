import { mount } from "enzyme";

import VMsTable from "./VMsTable";

describe("VMsTable", () => {
  it("shows a spinner if machines are loading", () => {
    const wrapper = mount(<VMsTable loading vms={[]} />);

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });
});
