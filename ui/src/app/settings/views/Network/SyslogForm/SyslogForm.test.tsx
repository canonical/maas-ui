import { mount } from "enzyme";
import type { FormikHelpers } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SyslogForm from "./SyslogForm";

import FormikForm from "app/base/components/FormikForm";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("SyslogForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        loaded: true,
        items: [
          {
            name: "remote_syslog",
            value: "",
          },
        ],
      }),
    });
  });

  it("displays a spinner if config is loading", () => {
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <SyslogForm />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("dispatches an action to update config on save button click", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SyslogForm />
      </Provider>
    );
    const resetForm: FormikHelpers<unknown>["resetForm"] = jest.fn();
    wrapper
      .find(FormikForm)
      .props()
      .onSubmit(
        {
          remote_syslog: "",
        },
        { resetForm } as FormikHelpers<unknown>
      );
    expect(store.getActions()).toEqual([
      {
        type: "config/update",
        payload: {
          params: [
            {
              name: "remote_syslog",
              value: "",
            },
          ],
        },
        meta: {
          model: "config",
          method: "update",
        },
      },
    ]);
  });

  it("dispatches action to fetch config if not already loaded", () => {
    state.config.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <SyslogForm />
      </Provider>
    );

    const fetchActions = store
      .getActions()
      .filter((action) => action.type.endsWith("fetch"));

    expect(fetchActions).toEqual([
      {
        type: "config/fetch",
        meta: {
          model: "config",
          method: "list",
        },
        payload: null,
      },
    ]);
  });
});
