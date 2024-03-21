import { Formik } from "formik";
import configureStore from "redux-mock-store";

import DeleteImageConfirm from "./DeleteImageConfirm";

import { Labels as TableDeleteConfirmLabels } from "@/app/base/components/TableDeleteConfirm/TableDeleteConfirm";
import { bootResourceActions } from "@/app/store/bootresource";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("DeleteImageConfirm", () => {
  it("calls closeForm on cancel click", async () => {
    const closeForm = vi.fn();
    const resource = factory.bootResource();
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [resource],
      }),
    });
    renderWithBrowserRouter(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteImageConfirm closeForm={closeForm} resource={resource} />
      </Formik>,
      { state }
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("runs cleanup function on unmount", () => {
    const resource = factory.bootResource();
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [resource],
      }),
    });
    const store = mockStore(state);
    const { unmount } = renderWithBrowserRouter(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteImageConfirm closeForm={vi.fn()} resource={resource} />
      </Formik>,
      { store }
    );
    unmount();

    const expectedAction = bootResourceActions.cleanup();
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === "bootresource/cleanup")
    ).toStrictEqual(expectedAction);
  });

  it("dispatches an action to delete an image", async () => {
    const resource = factory.bootResource({ id: 1 });
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [resource],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteImageConfirm closeForm={vi.fn()} resource={resource} />
      </Formik>,
      { store }
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
