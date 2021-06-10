import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DomainListHeader from "../DomainListHeader/DomainListHeader";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = rootStateFactory();
});
describe("DomainListHeaderForm", () => {
  it("displays the form when Add domains is clicked", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DomainListHeader />
      </Provider>
    );
    expect(wrapper.find("DomainListHeaderForm").exists()).toBe(false);

    wrapper.find("button[data-test='add-domain']").simulate("click");

    expect(wrapper.find("DomainListHeaderForm").exists()).toBe(true);
  });

  it("calls domainActions.create on save click", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DomainListHeader />
      </Provider>
    );
    wrapper.find("button[data-test='add-domain']").simulate("click");

    act(() =>
      wrapper.find("Formik").invoke("onSubmit")({
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
