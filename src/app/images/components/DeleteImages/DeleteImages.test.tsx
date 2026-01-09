import { Formik } from "formik";

import DeleteImages from "./DeleteImages";

import { Labels as TableDeleteConfirmLabels } from "@/app/base/components/TableDeleteConfirm/TableDeleteConfirm";
import { bootResourceActions } from "@/app/store/bootresource";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  mockSidePanel,
  renderWithProviders,
} from "@/testing/utils";

const { mockClose } = await mockSidePanel();

describe("DeleteImages", () => {
  it("calls closeForm on cancel click", async () => {
    renderWithProviders(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteImages rowSelection={{}} setRowSelection={vi.fn} />
      </Formik>
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("runs cleanup function on unmount", () => {
    const resource = factory.bootResource();
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [resource],
      }),
    });

    const {
      result: { unmount },
      store,
    } = renderWithProviders(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteImages rowSelection={{}} setRowSelection={vi.fn} />
      </Formik>,
      { state }
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

    const { store } = renderWithProviders(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteImages rowSelection={{ 1: true }} setRowSelection={vi.fn} />
      </Formik>,
      { state }
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
