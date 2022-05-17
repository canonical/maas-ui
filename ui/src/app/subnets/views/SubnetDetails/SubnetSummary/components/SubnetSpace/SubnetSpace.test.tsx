import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SubnetSpace from "./SubnetSpace";

import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

it("shows a warning tooltip if the subnet is not in a space", async () => {
  const state = rootStateFactory();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <SubnetSpace spaceId={null} />
    </Provider>
  );

  await userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", {
      name: /This subnet does not belong to a space/,
    })
  ).toBeInTheDocument();
});

it("does not show a warning tooltip if the subnet is in a space", async () => {
  const state = rootStateFactory();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <SubnetSpace spaceId={1} />
    </Provider>
  );

  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
