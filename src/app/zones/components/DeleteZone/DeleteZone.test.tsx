import { Formik } from "formik";

import DeleteZone from "./DeleteZone";

import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  userEvent,
  screen,
  renderWithBrowserRouter,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(zoneResolvers.deleteZone.handler());

describe("DeleteZone", () => {
  it("calls closeForm on cancel click", async () => {
    const closeForm = vi.fn();
    renderWithBrowserRouter(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteZone closeForm={closeForm} id={2} />
      </Formik>
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("displays error messages when delete zone fails", async () => {
    mockServer.use(
      zoneResolvers.deleteZone.error({ code: 400, message: "Uh oh!" })
    );

    renderWithBrowserRouter(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <DeleteZone closeForm={vi.fn()} id={2} />
      </Formik>
    );

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});
