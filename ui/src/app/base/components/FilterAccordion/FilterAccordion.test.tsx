import { mount } from "enzyme";

import FilterAccordion from "./FilterAccordion";
import type { Props as FilterAccordionProps } from "./FilterAccordion";

import type { Machine } from "app/store/machine/types";
import { machine as machineFactory } from "testing/factories";

describe("FilterAccordion", () => {
  let items: Machine[];
  let filterNames: FilterAccordionProps<Machine>["filterNames"];
  let filterOrder: string[];
  let getValue: FilterAccordionProps<Machine>["getValue"];
  beforeEach(() => {
    items = [
      machineFactory({
        link_speeds: [100],
        pool: {
          id: 1,
          name: "pool1",
        },
        pxe_mac: "aa:bb:cc",
        zone: {
          id: 1,
          name: "zone1",
        },
      }),
    ];
    filterNames = new Map([
      ["link_speeds", "Link speed"],
      ["pool", "Resource pool"],
      ["pxe_mac", "PXE Mac"],
      ["zone", "Zone"],
    ]);
    filterOrder = ["pool", "link_speeds", "zone", "pxe_mac"];
    getValue = (machine: Machine, filter: string) => {
      switch (filter) {
        case "pool":
          return machine.pool.name;
        case "zone":
          return machine.zone.name;
        case "link_speeds":
          return machine.link_speeds;
        case "pxe_mac":
          return machine.pxe_mac || null;
        default:
          return null;
      }
    };
  });

  it("can mark an item as active", () => {
    const wrapper = mount(
      <FilterAccordion
        filterNames={filterNames}
        filterOrder={filterOrder}
        filterString="pool:(=pool1)"
        getValue={getValue}
        items={items}
        onUpdateFilterString={() => null}
      />
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(wrapper.find(".filter-accordion__item.is-active").exists()).toBe(
      true
    );
  });

  it("can set a filter", () => {
    const onUpdateFilterString = jest.fn();
    const wrapper = mount(
      <FilterAccordion
        filterNames={filterNames}
        filterOrder={filterOrder}
        filterString=""
        getValue={getValue}
        items={items}
        onUpdateFilterString={onUpdateFilterString}
      />
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    wrapper.find("button[data-test='filter-pool']").simulate("click");
    expect(onUpdateFilterString).toHaveBeenCalledWith("pool:(=pool1)");
  });

  it("hides filters if there are no values", () => {
    delete items[0].pxe_mac;
    const wrapper = mount(
      <FilterAccordion
        filterNames={filterNames}
        filterOrder={filterOrder}
        filterString=""
        getValue={getValue}
        items={items}
        onUpdateFilterString={() => null}
      />
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(wrapper.find("[data-test='filter-pxe_mac']").exists()).toBe(false);
  });

  it("hides filters if the value is an empty array", () => {
    items[0].link_speeds = [];
    const wrapper = mount(
      <FilterAccordion
        filterNames={filterNames}
        filterOrder={filterOrder}
        filterString=""
        getValue={getValue}
        items={items}
        onUpdateFilterString={() => null}
      />
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(wrapper.find("[data-test='filter-link_speeds']").exists()).toBe(
      false
    );
  });
});
