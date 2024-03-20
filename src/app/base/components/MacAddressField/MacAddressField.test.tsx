import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import MacAddressField from "./MacAddressField";

import * as factory from "@/testing/factories";
import { userEvent, render, screen } from "@/testing/utils";

const mockStore = configureStore();

describe("MacAddressField", () => {
  it("formats text as it is typed", async () => {
    const store = mockStore(factory.rootState());
    render(
      <Provider store={store}>
        <Formik initialValues={{ mac_address: "" }} onSubmit={vi.fn()}>
          <MacAddressField label="MAC address" name="mac_address" />
        </Formik>
      </Provider>
    );
    const textbox = screen.getByRole("textbox", { name: "MAC address" });

    await userEvent.type(textbox, "1a2");

    expect(textbox).toHaveValue("1a:2");
  });
});
