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

  it("activates both buttons when between the start and end", () => {
    const wrapper = mount(
      <ArrowPagination
        currentPage={2}
        itemCount={75}
        pageSize={25}
        setCurrentPage={() => null}
      />
    );
    expect(wrapper.find("Button").first().prop("disabled")).toBe(false);
    expect(wrapper.find("Button").last().prop("disabled")).toBe(false);
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

  it("can show the page bounds when there are no items", () => {
    const wrapper = mount(
      <ArrowPagination
        currentPage={1}
        itemCount={0}
        pageSize={25}
        setCurrentPage={jest.fn()}
        showPageBounds
      />
    );
    expect(wrapper.find("[data-test='page-bounds']").text()).toBe("0 - 0 of 0");
  });

  it("can show the page bounds when there are more items than the current page shows", () => {
    const wrapper = mount(
      <ArrowPagination
        currentPage={1}
        itemCount={26}
        pageSize={25}
        setCurrentPage={jest.fn()}
        showPageBounds
      />
    );
    expect(wrapper.find("[data-test='page-bounds']").text()).toBe(
      "1 - 25 of 26"
    );
  });

  it("can show the page bounds when there are less items than the current page shows", () => {
    const wrapper = mount(
      <ArrowPagination
        currentPage={1}
        itemCount={24}
        pageSize={25}
        setCurrentPage={jest.fn()}
        showPageBounds
      />
    );
    expect(wrapper.find("[data-test='page-bounds']").text()).toBe(
      "1 - 24 of 24"
    );
  });

  it("shows a spinner in the page bound section if items are loading", () => {
    const wrapper = mount(
      <ArrowPagination
        currentPage={1}
        itemCount={24}
        loading
        pageSize={25}
        setCurrentPage={jest.fn()}
        showPageBounds
      />
    );
    expect(wrapper.find("[data-test='page-bounds'] Spinner").exists()).toBe(
      true
    );
  });
});
