import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SpaceSummary from "./SpaceSummary";

import {
  space as spaceFactory,
  spaceState as spaceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const getRootState = () =>
  rootStateFactory({
    space: spaceStateFactory({
      items: [
        spaceFactory({
          name: "outer",
          description: "The cold, dark, emptiness of space.",
        }),
      ],
      loading: false,
    }),
  });

it("displays space name and description", () => {
  const space = spaceFactory({
    name: "outer",
    description: "The cold, dark, emptiness of space.",
  });
  render(<SpaceSummary space={space} />);
  const spaceSummary = screen.getByRole("region", { name: "Space summary" });

  expect(within(spaceSummary).getByText("outer")).toBeInTheDocument();
  expect(
    within(spaceSummary).getByText("The cold, dark, emptiness of space.")
  ).toBeInTheDocument();
});

it("can open and close the Edit space summary form", async () => {
  const space = spaceFactory({
    name: "outer",
    description: "The cold, dark, emptiness of space.",
  });
  const state = getRootState();
  state.space.items = [space];
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <SpaceSummary space={state.space.items[0]} />
    </Provider>
  );
  const spaceSummary = screen.getByRole("region", { name: "Space summary" });
  await userEvent.click(
    within(spaceSummary).getAllByRole("button", { name: "Edit" })[0]
  );
  await waitFor(() =>
    expect(
      screen.getByRole("form", { name: "Edit space summary" })
    ).toBeInTheDocument()
  );

  await userEvent.click(
    within(spaceSummary).getByRole("button", { name: "Cancel" })
  );

  await waitFor(() =>
    expect(
      screen.queryByRole("form", { name: "Edit space summary" })
    ).not.toBeInTheDocument()
  );
});
