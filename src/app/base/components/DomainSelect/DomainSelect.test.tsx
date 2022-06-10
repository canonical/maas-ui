import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DomainSelect from "./DomainSelect";

import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DomainSelect", () => {
  it("renders a list of all domains in state", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [
          domainFactory({ id: 101, name: "Domain 1" }),
          domainFactory({ id: 202, name: "Domain 2" }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ domain: "" }} onSubmit={jest.fn()}>
          <DomainSelect name="domain" />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("select[name='domain']")).toMatchSnapshot();
  });

  it("dispatches action to fetch domains on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <Formik initialValues={{ domain: "" }} onSubmit={jest.fn()}>
          <DomainSelect name="domain" />
        </Formik>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "domain/fetch")
    ).toBe(true);
  });

  it("disables select if domains have not loaded", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: false,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ domain: "" }} onSubmit={jest.fn()}>
          <DomainSelect name="domain" />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("select[name='domain']").prop("disabled")).toBe(true);
  });
});
