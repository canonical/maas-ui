import { mount } from "enzyme";

import NetworkTab, { ExpandedState } from "./NetworkTab";

describe("NetworkTab", () => {
  it("displays the actions and interface and DHCP tables", () => {
    const wrapper = mount(
      <NetworkTab
        actions={() => <div data-testid="actions"></div>}
        addInterface={() => <div data-testid="add-interface"></div>}
        dhcpTable={() => <div data-testid="dhcp-table"></div>}
        expandedForm={() => <div data-testid="expanded-form"></div>}
        interfaceTable={() => <div data-testid="interface-table"></div>}
      />
    );
    expect(wrapper.find("[data-testid='interface-table']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='dhcp-table']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='actions']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='expanded-form']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='add-interface']").exists()).toBe(false);
  });

  it("displays the add interface form when expanded", () => {
    const wrapper = mount(
      <NetworkTab
        actions={(_, setExpanded) => (
          <button
            data-testid="add-button"
            onClick={() => setExpanded({ content: ExpandedState.ADD_PHYSICAL })}
          ></button>
        )}
        addInterface={() => <div data-testid="add-interface"></div>}
        dhcpTable={jest.fn()}
        expandedForm={jest.fn()}
        interfaceTable={jest.fn()}
      />
    );
    expect(wrapper.find("[data-testid='add-interface']").exists()).toBe(false);
    wrapper.find("button[data-testid='add-button']").simulate("click");
    expect(wrapper.find("[data-testid='add-interface']").exists()).toBe(true);
  });

  it("displays a form when expanded", () => {
    const wrapper = mount(
      <NetworkTab
        actions={(_, setExpanded) => (
          <button
            data-testid="edit-button"
            onClick={() => setExpanded({ content: ExpandedState.EDIT })}
          ></button>
        )}
        addInterface={jest.fn()}
        dhcpTable={jest.fn()}
        expandedForm={(expanded) =>
          expanded?.content === ExpandedState.EDIT ? (
            <div data-testid="edit-interface"></div>
          ) : null
        }
        interfaceTable={jest.fn()}
      />
    );
    expect(wrapper.find("[data-testid='edit-interface']").exists()).toBe(false);
    wrapper.find("button[data-testid='edit-button']").simulate("click");
    expect(wrapper.find("[data-testid='edit-interface']").exists()).toBe(true);
  });
});
