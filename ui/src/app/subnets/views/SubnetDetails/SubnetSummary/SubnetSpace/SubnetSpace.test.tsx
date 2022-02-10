import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SubnetSpace from "./SubnetSpace";

import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

it("shows a warning tooltip if the subnet is not in a space", () => {
  const state = rootStateFactory();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <SubnetSpace spaceId={null} />
    </Provider>
  );

  expect(screen.getByTestId("no-space")).toBeInTheDocument();
});

it("does not show a warning tooltip if the subnet is in a space", () => {
  const state = rootStateFactory();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <SubnetSpace spaceId={1} />
    </Provider>
  );

  expect(screen.queryByTestId("no-space")).not.toBeInTheDocument();
});
