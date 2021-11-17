import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DeleteImageConfirm from "./DeleteImageConfirm";

import { actions as bootResourceActions } from "app/store/bootresource";
import {
  bootResource as bootResourceFactory,
  bootResourceState as bootResourceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("DeleteImageConfirm", () => {
  it("calls closeForm on cancel click", () => {
    const closeForm = jest.fn();
    const resource = bootResourceFactory();
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [resource],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
          <DeleteImageConfirm closeForm={closeForm} resource={resource} />
        </Formik>
      </Provider>
    );
    wrapper.find("button[data-testid='action-cancel']").simulate("click");
    expect(closeForm).toHaveBeenCalled();
  });

  it("runs cleanup function on unmount", async () => {
    const resource = bootResourceFactory();
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [resource],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
          <DeleteImageConfirm closeForm={jest.fn()} resource={resource} />
        </Formik>
      </Provider>
    );
    wrapper.unmount();
    await waitForComponentToPaint(wrapper);

    const expectedAction = bootResourceActions.cleanup();
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === "bootresource/cleanup")
    ).toStrictEqual(expectedAction);
  });

  it("dispatches an action to delete an image", async () => {
    const resource = bootResourceFactory({ id: 1 });
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [resource],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
          <DeleteImageConfirm closeForm={jest.fn()} resource={resource} />
        </Formik>
      </Provider>
    );
    wrapper.find("button[data-testid='action-confirm']").simulate("click");
    await waitForComponentToPaint(wrapper);

    const expectedAction = bootResourceActions.deleteImage({ id: 1 });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === "bootresource/deleteImage")
    ).toStrictEqual(expectedAction);
  });
});
