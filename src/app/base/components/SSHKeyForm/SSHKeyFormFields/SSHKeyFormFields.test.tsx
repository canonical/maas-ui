import { Formik } from "formik";

import SSHKeyFormFields from "./SSHKeyFormFields";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

describe("SSHKeyFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      sshkey: factory.sshKeyState({
        loading: false,
        loaded: true,
        items: [],
      }),
    });
  });

  it("can render", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={vi.fn()}>
        <SSHKeyFormFields />
      </Formik>,
      { route: "/", state }
    );
    expect(
      screen.getByRole("combobox", { name: "Source" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Launchpad" })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "GitHub" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Upload" })).toBeInTheDocument();
    expect(screen.getByText("About SSH keys")).toBeInTheDocument();
  });

  it("can show id field", async () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={vi.fn()}>
        <SSHKeyFormFields />
      </Formik>,
      { route: "/", state }
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Source" }),
      "lp"
    );
    expect(
      screen.getByRole("textbox", { name: "Launchpad ID" })
    ).toBeInTheDocument();
  });

  it("can show key field", async () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={vi.fn()}>
        <SSHKeyFormFields />
      </Formik>,
      { route: "/", state }
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Source" }),
      "upload"
    );
    expect(
      screen.getByRole("textbox", { name: "Public key" })
    ).toBeInTheDocument();
  });
});
