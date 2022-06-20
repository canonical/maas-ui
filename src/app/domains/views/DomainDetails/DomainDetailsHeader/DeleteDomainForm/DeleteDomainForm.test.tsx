import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DeleteDomainForm from "./DeleteDomainForm";

import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

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
        <MemoryRouter>
          <CompatRouter>
            <DeleteDomainForm closeForm={closeForm} id={1} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("button[data-testid='cancel-action']").simulate("click");
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
        <MemoryRouter>
          <CompatRouter>
            <DeleteDomainForm closeForm={closeForm} id={1} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='delete-message']").text()).toBe(
      "Are you sure you want to delete this domain?"
    );

    submitFormikForm(wrapper);

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

  it("shows the correct text and disables the delete button if the domain has resource records", () => {
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
        <MemoryRouter>
          <CompatRouter>
            <DeleteDomainForm closeForm={closeForm} id={1} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='delete-message']").text()).toBe(
      "Domain cannot be deleted because it has resource records. Remove all resource records from the domain to allow deletion."
    );

    expect(wrapper.find("ActionButton[type='submit']").prop("disabled")).toBe(
      true
    );
  });
});
