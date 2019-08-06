import { mount } from "enzyme";
import React from "react";

import Pager from "./Pager";

describe("<Pager />", () => {
  // snapshot tests
  it("renders and matches the snapshot", () => {
    const component = mount(
      <Pager
        itemsPerPage={10}
        totalItems={50}
        paginate={jest.fn()}
        currentPage={1}
      />
    );

    expect(component).toMatchSnapshot();
  });

  // unit tests
  it("renders no pager with only a single page", () => {
    const component = mount(
      <Pager
        itemsPerPage={10}
        totalItems={5}
        paginate={jest.fn()}
        currentPage={1}
      />
    );

    expect(component.find("nav").exists()).toBe(false);
  });

  it("renders a simple pager with back and forward arrows if only five pages or less", () => {
    const component = mount(
      <Pager
        itemsPerPage={10}
        totalItems={50}
        paginate={jest.fn()}
        currentPage={1}
      />
    );

    expect(component.find("PagerItemSeparator").exists()).toBe(false);
    expect(component.find("PagerButton").length).toEqual(2);
    expect(component.find("button.p-pagination__link").length).toEqual(5);
  });

  it("renders a complex pager with truncation if more than five pages", () => {
    const component = mount(
      <Pager
        itemsPerPage={10}
        totalItems={1000}
        paginate={jest.fn()}
        currentPage={5}
      />
    );

    expect(component.find("PagerItemSeparator").length).toEqual(2);
    expect(component.find("PagerButton").length).toEqual(2);
    expect(component.find("PagerItem").length).toEqual(5);
  });

  it("does not render a truncation separator if currentPage is contiguous at start", () => {
    const component = mount(
      <Pager
        itemsPerPage={10}
        totalItems={1000}
        paginate={jest.fn()}
        currentPage={2}
      />
    );

    expect(component.find("PagerItemSeparator").length).toEqual(1);
    expect(component.find("PagerButton").length).toEqual(2);
    expect(component.find("PagerItem").length).toEqual(5);
  });

  it("does not render a truncation separator if currentPage is contiguous at end", () => {
    const component = mount(
      <Pager
        itemsPerPage={10}
        totalItems={1000}
        paginate={jest.fn()}
        currentPage={98}
      />
    );

    expect(component.find("PagerItemSeparator").length).toEqual(1);
    expect(component.find("PagerButton").length).toEqual(2);
    expect(component.find("PagerItem").length).toEqual(5);
  });
});
