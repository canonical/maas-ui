import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DefinitionField, { INVALID_XPATH_ERROR, Label } from "./DefinitionField";

import type { RootState } from "app/store/root/types";
import {
  tag as tagFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    tag: tagStateFactory({
      items: [
        tagFactory({
          id: 1,
          name: "rad",
        }),
      ],
    }),
  });
});

it("overrides the xpath errors", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik
          initialErrors={{
            definition: INVALID_XPATH_ERROR,
          }}
          initialValues={{}}
          onSubmit={jest.fn()}
        >
          <DefinitionField />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("textbox", { name: Label.Definition })
  ).toHaveErrorMessage(
    "The definition is an invalid XPath expression. See our XPath documentation for more examples."
  );
});

it("displays a warning when changing the definition", async () => {
  state.tag.items[0].definition = "def1";
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik
          initialErrors={{
            definition: INVALID_XPATH_ERROR,
          }}
          initialValues={{}}
          onSubmit={jest.fn()}
        >
          <DefinitionField id={1} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  userEvent.type(
    screen.getByRole("textbox", { name: Label.Definition }),
    "def2"
  );
  await waitFor(() => {
    expect(
      screen.getByText(/This tag will be unassigned/i)
    ).toBeInTheDocument();
  });
});
