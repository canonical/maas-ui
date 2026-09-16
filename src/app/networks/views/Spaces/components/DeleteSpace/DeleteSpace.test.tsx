import DeleteSpace from "./DeleteSpace";

import { spaceActions } from "@/app/store/space";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  waitFor,
  renderWithProviders,
} from "@/testing/utils";

it("does not allow deletion if the space has subnets attached", () => {
  const space = factory.space({ id: 1, subnet_ids: [1] });
  const state = factory.rootState({
    space: factory.spaceState({
      items: [space],
    }),
  });

  renderWithProviders(<DeleteSpace id={space.id} />, { state });

  expect(
    screen.getByText(
      "Space cannot be deleted because it has subnets attached. Remove all subnets from the space to allow deletion."
    )
  ).toBeInTheDocument();
});

it("displays a delete confirmation if the space has no subnets attached", () => {
  const space = factory.space({ id: 1, subnet_ids: [] });
  const state = factory.rootState({
    space: factory.spaceState({ items: [space] }),
  });

  renderWithProviders(<DeleteSpace id={space.id} />, { state });

  expect(
    screen.getByText("Are you sure you want to delete this space?")
  ).toBeInTheDocument();
});

it("deletes the space when confirmed", async () => {
  const space = factory.space({ id: 1, subnet_ids: [] });
  const state = factory.rootState({
    space: factory.spaceState({ items: [space] }),
  });

  const { store } = renderWithProviders(<DeleteSpace id={space.id} />, {
    state,
  });

  await userEvent.click(screen.getByRole("button", { name: "Delete space" }));

  const expectedActions = [
    spaceActions.cleanup(),
    spaceActions.delete(space.id),
  ];
  const actualActions = store.getActions();
  await waitFor(() => {
    expectedActions.forEach((expectedAction) => {
      expect(
        actualActions.find(
          (actualAction) => actualAction.type === expectedAction.type
        )
      ).toStrictEqual(expectedAction);
    });
  });
});
