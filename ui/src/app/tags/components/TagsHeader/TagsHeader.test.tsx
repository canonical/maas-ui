import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagsHeader from "./TagsHeader";

import { TagHeaderViews } from "app/tags/constants";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

it("can display the add tag form", () => {
  const store = mockStore(rootStateFactory());
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
        <TagsHeader
          headerContent={{ view: TagHeaderViews.AddTag }}
          setHeaderContent={jest.fn()}
        />
      </MemoryRouter>
    </Provider>
  );
  // TODO: Test for the form when it is implemented in:
  // https://github.com/canonical-web-and-design/app-tribe/issues/690
  expect(screen.getByText("Add tag form")).toBeInTheDocument();
});
