import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DeleteImageConfirm from "./DeleteImageConfirm";

import { Labels as TableDeleteConfirmLabels } from "app/base/components/TableDeleteConfirm/TableDeleteConfirm";
import { actions as bootResourceActions } from "app/store/bootresource";
import type { RootState } from "app/store/root/types";
import {
  bootResource as bootResourceFactory,
  bootResourceState as bootResourceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("DeleteImageConfirm", () => {
  it("calls closeForm on cancel click", async () => {
    const closeForm = jest.fn();
    const resource = bootResourceFactory();
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [resource],
      }),
    });
    renderWithBrowserRouter(
      <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
        <DeleteImageConfirm closeForm={closeForm} resource={resource} />
      </Formik>,
      { state }
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("runs cleanup function on unmount", () => {
    const resource = bootResourceFactory();
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [resource],
      }),
    });
    const store = mockStore(state);
    const { unmount } = render(
      <Provider store={store}>
        <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
          <DeleteImageConfirm closeForm={jest.fn()} resource={resource} />
        </Formik>
      </Provider>
    );
    unmount();

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
    render(
      <Provider store={store}>
        <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
          <DeleteImageConfirm closeForm={jest.fn()} resource={resource} />
        </Formik>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: TableDeleteConfirmLabels.ConfirmLabel,
      })
    );

    const expectedAction = bootResourceActions.deleteImage({ id: 1 });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === "bootresource/deleteImage")
    ).toStrictEqual(expectedAction);
  });
});
