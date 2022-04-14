import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NodeNameFields from "./NodeNameFields";

import type { RootState } from "app/store/root/types";
import {
  domainState as domainStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NodeNameFields", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("displays a spinner when loading domains", () => {
    state.domain.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={{
              domain: "",
              hostname: "",
            }}
            onSubmit={jest.fn()}
          >
            <NodeNameFields setHostnameError={jest.fn()} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the fields", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={{
              domain: "",
              hostname: "",
            }}
            onSubmit={jest.fn()}
          >
            <NodeNameFields setHostnameError={jest.fn()} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NodeNameFields")).toMatchSnapshot();
  });

  it("disables fields when saving", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialValues={{
              domain: "",
              hostname: "",
            }}
            onSubmit={jest.fn()}
          >
            <NodeNameFields saving setHostnameError={jest.fn()} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("FormikField").everyWhere((n) => Boolean(n.prop("disabled")))
    ).toBe(true);
  });

  it("updates the hostname errors if they exist", () => {
    const setHostnameError = jest.fn();
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Formik
            initialErrors={{ hostname: "Uh oh!" }}
            initialValues={{
              domain: "",
              hostname: "",
            }}
            onSubmit={jest.fn()}
          >
            <NodeNameFields saving setHostnameError={setHostnameError} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(setHostnameError).toHaveBeenCalledWith("Uh oh!");
  });
});
