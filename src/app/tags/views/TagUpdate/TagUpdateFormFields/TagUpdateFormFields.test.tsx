import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagUpdateFormFields from "./TagUpdateFormFields";

import type { RootState } from "app/store/root/types";
import { Label as DefinitionLabel } from "app/tags/components/DefinitionField";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

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

it("hides the definition field if it is a manual tag", async () => {
  state.tag.items[0].definition = "";
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <TagUpdateFormFields id={1} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.queryByRole("textbox", { name: DefinitionLabel.Definition })
  ).not.toBeInTheDocument();
  expect(
    screen.getByText(/Definitions cannot be added to manual tags/i)
  ).toBeInTheDocument();
});

it("displays the definition field if it is an automatic tag", async () => {
  state.tag.items[0].definition = "def1";
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <TagUpdateFormFields id={1} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("textbox", { name: DefinitionLabel.Definition })
  ).toBeInTheDocument();
  expect(
    screen.queryByText(/Definitions cannot be added to manual tags/i)
  ).not.toBeInTheDocument();
});
