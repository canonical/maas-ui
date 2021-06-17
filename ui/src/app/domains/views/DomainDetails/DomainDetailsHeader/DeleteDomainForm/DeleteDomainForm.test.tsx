import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DeleteDomainForm from "./DeleteDomainForm";

import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeleteDomainForm", () => {
  it("calls closeForm on cancel click", () => {
    const closeForm = jest.fn();
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ id: 1, name: "domain-in-the-brain" })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DeleteDomainForm id={1} closeForm={closeForm} />
      </Provider>
    );
    wrapper.find("button[data-test='close-confirm-delete']").simulate("click");
    expect(closeForm).toHaveBeenCalled();
  });

  it("shows the correct text if the domain is deletable and dispatches the correct action when delete is clicked", () => {
    const closeForm = jest.fn();
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [
          domainFactory({
            id: 1,
            name: "domain-in-the-brain",
            resource_count: 0,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DeleteDomainForm id={1} closeForm={closeForm} />
      </Provider>
    );

    expect(wrapper.find("[data-test='delete-message']").text()).toBe(
      "Are you sure you want to delete this domain?"
    );

    wrapper.find("button[data-test='delete-domain']").simulate("click");

    expect(
      store.getActions().find((action) => action.type === "domain/delete")
    ).toStrictEqual({
      type: "domain/delete",
      meta: {
        method: "delete",
        model: "domain",
      },
      payload: {
        params: {
          id: 1,
        },
      },
    });
  });

  it("shows the correct text and hides the delete button if the domain is has resource records", () => {
    const closeForm = jest.fn();
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [
          domainFactory({
            id: 1,
            name: "domain-in-the-brain",
            resource_count: 12,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DeleteDomainForm id={1} closeForm={closeForm} />
      </Provider>
    );

    expect(wrapper.find("[data-test='delete-message']").text()).toBe(
      "Domain cannot be deleted because it has resource records. Remove all resource records from the domain to allow deletion."
    );

    expect(
      wrapper.find("button[data-test='delete-domain']").exists()
    ).toBeFalsy();
  });
});
