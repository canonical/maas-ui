// import { mount } from "enzyme";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ZonesListHeader from "./ZonesListHeader";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("ZonesListHeader", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("displays the form when Add AZ is clicked", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ZonesListHeader />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.queryByRole("form", { name: "Add AZ" })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Add AZ" })
    )

    expect(
      screen.getByRole("form", { name: "Add AZ" })
    ).toBeInTheDocument();
  });
});
