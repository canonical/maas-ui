import { Formik } from "formik";
import configureStore from "redux-mock-store";

import BridgeFormFields from "./BridgeFormFields";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, screen, renderWithProviders } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("BridgeFormFields", () => {
  it("does not display the fd field if stp isn't on", async () => {
    const store = mockStore(factory.rootState());
    renderWithProviders(
      <Formik initialValues={{}} onSubmit={vi.fn()}>
        <BridgeFormFields />
      </Formik>,
      { store }
    );
    expect(
      screen.queryByRole("textbox", { name: "Forward delay (ms)" })
    ).not.toBeInTheDocument();
  });

  it("displays the fd field if stp is on", async () => {
    const store = mockStore(factory.rootState());
    renderWithProviders(
      <Formik initialValues={{}} onSubmit={vi.fn()}>
        <BridgeFormFields />
      </Formik>,
      { store }
    );

    await userEvent.click(screen.getByRole("checkbox", { name: "STP" }));
    expect(
      screen.getByRole("textbox", { name: "Forward delay (ms)" })
    ).toBeInTheDocument();
  });
});
