import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DomainsTable from "./DomainsTable";

import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DomainsTable", () => {
  it("can update the sort order", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [
          domainFactory({
            name: "b",
          }),
          domainFactory({
            name: "c",
          }),
          domainFactory({
            name: "a",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DomainsTable />
      </Provider>
    );
    const getNameFromTable = (rowNumber: number) =>
      wrapper
        .find("tbody TableRow")
        .at(rowNumber)
        .find("[data-test='domain-name']")
        .at(0); // both TableCell and td have the same data-test value

    // Sorted ascending by name by default
    expect(getNameFromTable(0).text()).toBe("a");
    expect(getNameFromTable(1).text()).toBe("b");
    expect(getNameFromTable(2).text()).toBe("c");

    // Change to sort descending by name
    wrapper.find("[data-test='domain-name-header']").at(0).simulate("click");
    expect(getNameFromTable(0).text()).toBe("c");
    expect(getNameFromTable(1).text()).toBe("b");
    expect(getNameFromTable(2).text()).toBe("a");

    // Change to no sort
    wrapper.find("[data-test='domain-name-header']").at(0).simulate("click");
    expect(getNameFromTable(0).text()).toBe("b");
    expect(getNameFromTable(1).text()).toBe("c");
    expect(getNameFromTable(2).text()).toBe("a");
  });
});
