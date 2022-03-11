import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagHeaderForms from "./TagHeaderForms";

import { TagHeaderViews } from "app/tags/constants";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

it("can display the add tag form", () => {
  const store = mockStore(rootStateFactory());
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <TagHeaderForms
          headerContent={{ view: TagHeaderViews.AddTag }}
          setHeaderContent={jest.fn()}
        />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByRole("form", { name: "Create tag" })).toBeInTheDocument();
});
