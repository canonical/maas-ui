import { Formik } from "formik";

import DeleteImages from "./DeleteImages";

import { imageResolvers } from "@/testing/resolvers/images";
import {
  userEvent,
  screen,
  mockSidePanel,
  renderWithProviders,
  setupMockServer,
  waitForLoading,
  waitFor,
} from "@/testing/utils";

const { mockClose } = await mockSidePanel();
const mockServer = setupMockServer(
  imageResolvers.listSelectionStatuses.handler(),
  imageResolvers.deleteSelections.handler()
);

describe("DeleteImages", () => {
  it("calls closeForm on cancel click", async () => {
    renderWithProviders(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteImages rowSelection={{}} setRowSelection={vi.fn} />
      </Formik>
    );
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls delete images on save click", async () => {
    renderWithProviders(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteImages rowSelection={{}} setRowSelection={vi.fn} />
      </Formik>
    );
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: /Delete/i }));
    await waitFor(() => {
      expect(imageResolvers.deleteSelections.resolved).toBeTruthy();
    });
  });

  it("displays error messages when delete image fails", async () => {
    mockServer.use(
      imageResolvers.deleteSelections.error({ code: 400, message: "Uh oh!" })
    );
    renderWithProviders(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteImages rowSelection={{}} setRowSelection={vi.fn} />
      </Formik>
    );
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});
