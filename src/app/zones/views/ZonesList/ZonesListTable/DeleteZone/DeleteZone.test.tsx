import { Formik } from "formik";

import DeleteZone from "./DeleteZone";

import { userEvent, screen, renderWithBrowserRouter } from "@/testing/utils";

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
});
