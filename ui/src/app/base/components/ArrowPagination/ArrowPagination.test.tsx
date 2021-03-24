import { mount } from "enzyme";

import ArrowPagination from "./ArrowPagination";

describe("ArrowPagination", () => {
  it("disables both buttons when there are no items", () => {
    const wrapper = mount(
      <ArrowPagination
        currentPage={1}
        itemCount={0}
        pageSize={25}
        setCurrentPage={() => null}
      />
    );
    expect(wrapper.find("Button").first().prop("disabled")).toBe(true);
    expect(wrapper.find("Button").last().prop("disabled")).toBe(true);
  });

  it("disables the back button when on the first page", () => {
    const wrapper = mount(
      <ArrowPagination
        currentPage={1}
        itemCount={50}
        pageSize={25}
        setCurrentPage={() => null}
      />
    );
    expect(wrapper.find("Button").first().prop("disabled")).toBe(true);
  });

  it("disables the forward button when on the last page", () => {
    const wrapper = mount(
      <ArrowPagination
        currentPage={2}
        itemCount={50}
        pageSize={25}
        setCurrentPage={() => null}
      />
    );
    expect(wrapper.find("Button").last().prop("disabled")).toBe(true);
  });
});
