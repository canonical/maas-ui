import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import DefinitionField, { INVALID_XPATH_ERROR, Label } from "./DefinitionField";

import * as hooks from "@/app/base/hooks/analytics";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = factory.rootState({
    tag: factory.tagState({
      items: [
        factory.tag({
          id: 1,
          name: "rad",
        }),
      ],
    }),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
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
          onSubmit={vi.fn()}
        >
          <DefinitionField />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("textbox", { name: Label.Definition })
  ).toHaveAccessibleErrorMessage(
    "The definition is an invalid XPath expression. See our XPath expressions documentation for more examples."
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
          onSubmit={vi.fn()}
        >
          <DefinitionField id={1} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.Definition }),
    "def2"
  );
  await waitFor(() => {
    expect(
      screen.getByText(/This tag will be unassigned/i)
    ).toBeInTheDocument();
  });
});

it("sends analytics when there is an xpath error", async () => {
  const mockSendAnalytics = vi.fn();
  vi.spyOn(hooks, "useSendAnalytics").mockImplementation(
    () => mockSendAnalytics
  );
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik
          initialErrors={{
            definition: INVALID_XPATH_ERROR,
          }}
          initialValues={{}}
          onSubmit={vi.fn()}
        >
          <DefinitionField />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  expect(mockSendAnalytics).toHaveBeenCalled();
  expect(mockSendAnalytics.mock.calls[0]).toEqual([
    "XPath tagging",
    "Invalid XPath",
    "Save",
  ]);
});

it("does not send xpath error analytics more than once", async () => {
  const mockSendAnalytics = vi.fn();
  vi.spyOn(hooks, "useSendAnalytics").mockImplementation(
    () => mockSendAnalytics
  );
  const store = mockStore(state);
  const Field = () => (
    <Provider store={store}>
      <MemoryRouter>
        <Formik
          initialErrors={{
            definition: INVALID_XPATH_ERROR,
          }}
          initialValues={{}}
          onSubmit={vi.fn()}
        >
          <DefinitionField />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const { rerender } = render(<Field />);
  rerender(<Field />);
  expect(mockSendAnalytics).toHaveBeenCalledTimes(1);
});
