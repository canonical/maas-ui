import { createMemoryHistory } from "history";
import configureStore from "redux-mock-store";

import { SpaceDetailsSidePanelViews } from "../constants";

import SpaceDetailsHeader from "./SpaceDetailsHeader";

import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen, userEvent } from "@/testing/utils";

const renderTestCase = (
  space = factory.space({
    id: 1,
    name: "space1",
    description: "space 1 description",
  })
) => {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: urls.subnets.space.index({ id: space.id }) }],
  });
  const state = factory.rootState({
    space: factory.spaceState({
      items: [space],
      loading: false,
    }),
  });
  const setSidePanelContent = vi.fn();
  const store = configureStore()(state);
  return {
    setSidePanelContent,
    ...renderWithProviders(
      <SpaceDetailsHeader
        setSidePanelContent={setSidePanelContent}
        sidePanelContent={null}
        space={space}
      />,
      { store }
    ),
    history,
  };
};

it("shows the space name as the section title", () => {
  renderTestCase(factory.space({ id: 1, name: "space-1" }));

  expect(screen.getByTestId("section-header-title")).toHaveTextContent(
    "space-1"
  );
});

it("calls a function to open the side panel when the delete button is clicked", async () => {
  const { setSidePanelContent } = renderTestCase(
    factory.space({ id: 1, name: "space-1" })
  );

  await userEvent.click(screen.getByRole("button", { name: "Delete space" }));
  expect(setSidePanelContent).toHaveBeenCalledWith({
    view: SpaceDetailsSidePanelViews.DELETE_SPACE,
  });
});
