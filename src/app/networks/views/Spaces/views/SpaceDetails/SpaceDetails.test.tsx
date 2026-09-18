import { Route, Routes } from "react-router";

import SpaceDetails from "./SpaceDetails";

import urls from "@/app/base/urls";
import { DeleteSpace } from "@/app/networks/views/Spaces/components";
import { spaceActions } from "@/app/store/space";
import * as factory from "@/testing/factories";
import {
  mockModal,
  renderWithProviders,
  screen,
  userEvent,
  within,
} from "@/testing/utils";

const { mockOpen } = await mockModal();

describe("SpaceDetails", () => {
  it("dispatches actions to get and set space as active on mount", () => {
    const { store } = renderWithProviders(
      <Routes>
        <Route
          element={<SpaceDetails />}
          path={urls.networks.space.index(null)}
        />
      </Routes>,
      { initialEntries: [urls.networks.space.index({ id: 1 })] }
    );

    const expectedActions = [spaceActions.get(1), spaceActions.setActive(1)];
    const actualActions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(
        actualActions.find(
          (actualAction) => actualAction.type === expectedAction.type
        )
      ).toStrictEqual(expectedAction);
    });
  });

  it("displays a message if the space does not exist", () => {
    const state = factory.rootState({
      space: factory.spaceState({
        items: [],
        loading: false,
      }),
    });
    renderWithProviders(
      <Routes>
        <Route
          element={<SpaceDetails />}
          path={urls.networks.space.index(null)}
        />
      </Routes>,
      { initialEntries: [urls.networks.space.index({ id: 1 })], state }
    );

    expect(screen.getByText("Space not found")).toBeInTheDocument();
  });

  it("shows a spinner if the space has not loaded yet", () => {
    const state = factory.rootState({
      space: factory.spaceState({
        items: [],
        loading: true,
      }),
    });
    renderWithProviders(
      <Routes>
        <Route
          element={<SpaceDetails />}
          path={urls.networks.space.index(null)}
        />
      </Routes>,
      { initialEntries: [urls.networks.space.index({ id: 1 })], state }
    );

    expect(
      screen.getByTestId("section-header-title-spinner")
    ).toBeInTheDocument();
  });

  it("displays space details", async () => {
    const space = factory.space({
      id: 1,
      name: "space1",
      description: "space 1 description",
    });
    const state = factory.rootState({
      space: factory.spaceState({
        items: [space],
        loading: false,
      }),
    });
    renderWithProviders(
      <Routes>
        <Route
          element={<SpaceDetails />}
          path={urls.networks.space.index(null)}
        />
      </Routes>,
      { initialEntries: [urls.networks.space.index({ id: 1 })], state }
    );

    const spaceSummary = await screen.findByRole("region", {
      name: "Space summary",
    });
    expect(within(spaceSummary).getByText(space.name)).toBeInTheDocument();
    expect(
      within(spaceSummary).getByText(space.description)
    ).toBeInTheDocument();
  });

  it("opens a modal to delete the space", async () => {
    const space = factory.space({
      id: 1,
      name: "space1",
      description: "space 1 description",
    });
    const state = factory.rootState({
      space: factory.spaceState({
        items: [space],
        loading: false,
      }),
    });
    renderWithProviders(
      <Routes>
        <Route
          element={<SpaceDetails />}
          path={urls.networks.space.index(null)}
        />
      </Routes>,
      { initialEntries: [urls.networks.space.index({ id: 1 })], state }
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete space" }));

    expect(mockOpen).toHaveBeenCalledWith({
      component: DeleteSpace,
      title: "Delete space",
      props: { id: space.id },
    });
  });
});
