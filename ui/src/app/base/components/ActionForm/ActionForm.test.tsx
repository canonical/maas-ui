import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ActionForm from "./ActionForm";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";
import { submitFormikForm, waitForComponentToPaint } from "testing/utils";

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
        <ActionForm
          actionName="action"
          initialValues={{}}
          loaded={false}
          modelName="machine"
          onSubmit={jest.fn()}
          processingCount={0}
          selectedCount={1}
        />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can show the correct submit label", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ActionForm
          actionName="action"
          initialValues={{}}
          modelName="machine"
          onSubmit={jest.fn()}
          processingCount={0}
          selectedCount={1}
        />
      </Provider>
    );

    expect(wrapper.find("ActionButton").text()).toBe("Process machine");
  });

  it("can override the submit label", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ActionForm
          actionName="action"
          initialValues={{}}
          modelName="machine"
          onSubmit={jest.fn()}
          processingCount={0}
          selectedCount={1}
          submitLabel="Special save"
        />
      </Provider>
    );

    expect(wrapper.find("ActionButton").text()).toBe("Special save");
  });

  it("can show the correct saving state", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ActionForm
          actionName="action"
          initialValues={{}}
          modelName="machine"
          onSubmit={jest.fn()}
          processingCount={1}
          selectedCount={2}
        />
      </Provider>
    );
    submitFormikForm(wrapper);
    wrapper.update();

    expect(wrapper.find("[data-testid='saving-label']").text()).toBe(
      "Processing 1 of 2 machines..."
    );
    expect(wrapper.find("ActionButton").prop("loading")).toBe(true);
    expect(wrapper.find("ActionButton").prop("disabled")).toBe(true);
  });

  it("shows correct saving label if selectedCount changes after submit", async () => {
    const store = mockStore(state);
    const Proxy = ({ selectedCount }: { selectedCount: number }) => (
      <Provider store={store}>
        <ActionForm
          actionName="action"
          initialValues={{}}
          modelName="machine"
          onSubmit={jest.fn()}
          processingCount={2}
          selectedCount={selectedCount}
        />
      </Provider>
    );
    const wrapper = mount(<Proxy selectedCount={2} />);

    // Submit the form to start processing.
    wrapper.find("Formik").simulate("submit");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("[data-testid='saving-label']").text()).toBe(
      "Processing 0 of 2 machines..."
    );

    // Change the selected count prop - the label should stay the same.
    wrapper.setProps({ selectedCount: 1 });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("[data-testid='saving-label']").text()).toBe(
      "Processing 0 of 2 machines..."
    );
  });
});
