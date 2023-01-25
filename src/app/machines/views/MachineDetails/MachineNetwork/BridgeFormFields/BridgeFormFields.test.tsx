import { Formik } from "formik";
import configureStore from "redux-mock-store";

import BridgeFormFields from "./BridgeFormFields";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("BridgeFormFields", () => {
  it("does not display the fd field if stp isn't on", async () => {
    const store = mockStore(rootStateFactory());
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BridgeFormFields />
      </Formik>,
      { route: "/machines", store }
    );
    expect(
      screen.queryByRole("textbox", { name: "Forward delay (ms)" })
    ).not.toBeInTheDocument();
  });

  it("displays the fd field if stp is on", async () => {
    const store = mockStore(rootStateFactory());
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BridgeFormFields />
      </Formik>,
      { route: "/machines", store }
    );

    await userEvent.click(screen.getByRole("checkbox", { name: "STP" }));
    expect(
      screen.getByRole("textbox", { name: "Forward delay (ms)" })
    ).toBeInTheDocument();
  });
});
