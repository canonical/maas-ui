import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DomainListHeaderForm from "./DomainListHeaderForm";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("DomainListHeaderForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("runs closeForm function when the cancel button is clicked", () => {
    const closeForm = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DomainListHeaderForm closeForm={closeForm} />
      </Provider>
    );

    wrapper.find("button[data-test='cancel-action']").simulate("click");
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls domainActions.create on save click", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DomainListHeaderForm closeForm={jest.fn()} />
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        name: "some-domain",
        authoritative: true,
      })
    );

    expect(
      store.getActions().find((action) => action.type === "domain/create")
    ).toStrictEqual({
      type: "domain/create",
      meta: {
        method: "create",
        model: "domain",
      },
      payload: {
        params: {
          authoritative: true,
          name: "some-domain",
        },
      },
    });
  });
});
