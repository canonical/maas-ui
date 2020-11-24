import React from "react";

import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ActionForm from "./ActionForm";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

let state: RootState;
const mockStore = configureStore();

describe("ActionForm", () => {
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("shows a spinner if form has not fully loaded", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ActionForm loaded={false} modelName="machine" onSubmit={jest.fn()} />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can show the correct submit label", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ActionForm modelName="machine" onSubmit={jest.fn()} />
      </Provider>
    );

    expect(wrapper.find("ActionButton").text()).toBe("Process machine");
  });

  it("can show the correct saving state", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ActionForm
          modelName="machine"
          onSubmit={jest.fn()}
          processingCount={1}
          selectedCount={2}
        />
      </Provider>
    );
    act(() => {
      wrapper.find("Formik").prop("onSubmit")();
    });
    wrapper.update();

    expect(wrapper.find("[data-test='loading-label']").text()).toBe(
      "Processing 1 of 2 machines..."
    );
    expect(wrapper.find("ActionButton").prop("loading")).toBe(true);
    expect(wrapper.find("ActionButton").prop("disabled")).toBe(true);
  });

  it("runs clearSelectedAction function when processing complete", () => {
    const store = mockStore(state);
    const clearSelectedAction = jest.fn();
    const Proxy = ({ processingCount }) => (
      <Provider store={store}>
        <ActionForm
          clearSelectedAction={clearSelectedAction}
          modelName="machine"
          onSubmit={jest.fn()}
          processingCount={processingCount}
          selectedCount={2}
        />
      </Provider>
    );
    const wrapper = mount(<Proxy processingCount={1} />);

    act(() => {
      wrapper.find("Formik").prop("onSubmit")();
    });
    wrapper.setProps({ processingCount: 0 });
    wrapper.update();

    expect(clearSelectedAction).toHaveBeenCalled();
  });

  it("runs onSuccess function if processing is successful", () => {
    const store = mockStore(state);
    const onSuccess = jest.fn();
    const Proxy = ({ processingCount }) => (
      <Provider store={store}>
        <ActionForm
          modelName="machine"
          onSubmit={jest.fn()}
          onSuccess={onSuccess}
          processingCount={processingCount}
          selectedCount={2}
        />
      </Provider>
    );
    const wrapper = mount(<Proxy processingCount={1} />);

    act(() => {
      wrapper.find("Formik").prop("onSubmit")();
    });
    wrapper.setProps({ processingCount: 0 });
    wrapper.update();

    expect(onSuccess).toHaveBeenCalled();
  });

  it("does not run clearSelectedAction function if errors occur while processing", () => {
    const store = mockStore(state);
    const clearSelectedAction = jest.fn();
    const Proxy = ({ errors, processingCount }) => (
      <Provider store={store}>
        <ActionForm
          clearSelectedAction={clearSelectedAction}
          errors={errors}
          modelName="machine"
          onSubmit={jest.fn()}
          processingCount={processingCount}
          selectedCount={2}
        />
      </Provider>
    );
    const wrapper = mount(<Proxy errors={{}} processingCount={1} />);

    act(() => {
      wrapper.find("Formik").prop("onSubmit")();
    });
    wrapper.setProps({
      errors: { name: "Name already exists" },
      processingCount: 0,
    });
    wrapper.update();

    expect(clearSelectedAction).not.toHaveBeenCalled();
  });
});
