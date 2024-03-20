import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LXDVMsSummaryCard from "./LXDVMsSummaryCard";

import * as factory from "@/testing/factories";

const mockStore = configureStore();

describe("LXDVMsSummaryCard", () => {
  it("shows a spinner if pod has not loaded yet", () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [],
        loaded: false,
      }),
    });

    const store = mockStore(state);
    render(
      <Provider store={store}>
        <LXDVMsSummaryCard id={1} />
      </Provider>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
