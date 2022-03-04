import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagList, { TestId } from "./TagList";

import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    tag: tagStateFactory({
      items: [
        tagFactory({
          name: "rad",
        }),
        tagFactory({
          name: "cool",
        }),
      ],
    }),
  });
});

it("renders", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagList />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByTestId(TestId.TagListControls)).toBeInTheDocument();
  expect(screen.getByTestId(TestId.TagTable)).toBeInTheDocument();
});
