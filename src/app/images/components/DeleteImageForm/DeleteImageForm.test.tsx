import { Formik } from "formik";
import configureStore from "redux-mock-store";

import DeleteImageForm from "./DeleteImageForm";

import { Labels as TableDeleteConfirmLabels } from "@/app/base/components/TableDeleteConfirm/TableDeleteConfirm";
import { bootResourceActions } from "@/app/store/bootresource";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  mockSidePanel,
  renderWithProviders,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();

const { mockClose } = await mockSidePanel();

describe("DeleteImageForm", () => {
  it("calls closeForm on cancel click", async () => {
    const resource = factory.bootResource();
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [resource],
      }),
    });
    renderWithProviders(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteImageForm resource={resource} />
      </Formik>,
      { state }
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
    const store = mockStore(state);
    const { result } = renderWithProviders(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteImageForm resource={resource} />
      </Formik>,
      { store }
    );
    result.unmount();

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
    renderWithProviders(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteImageForm resource={resource} />
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
