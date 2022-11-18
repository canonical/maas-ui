import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ActionForm, { Labels } from "./ActionForm";

import { TestIds } from "app/base/components/FormikFormButtons";
import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

let state: RootState;
const mockStore = configureStore();

describe("ActionForm", () => {
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("shows a spinner if form has not fully loaded", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ActionForm
              actionName="action"
              initialValues={{}}
              loaded={false}
              modelName="machine"
              onSubmit={jest.fn()}
              processingCount={0}
              selectedCount={1}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("alert", { name: Labels.LoadingForm })
    ).toBeInTheDocument();
  });

  it("can show the default submit label", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ActionForm
              actionName="action"
              initialValues={{}}
              modelName="machine"
              onSubmit={jest.fn()}
              processingCount={0}
              selectedCount={1}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("button", { name: "Process machine" })
    ).toBeInTheDocument();
  });

  it("can override the submit label", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ActionForm
              actionName="action"
              initialValues={{}}
              modelName="machine"
              onSubmit={jest.fn()}
              processingCount={0}
              selectedCount={1}
              submitLabel="Special save"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("button", { name: "Special save" })
    ).toBeInTheDocument();
  });

  it("can show the correct saving state", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ActionForm
              actionName="action"
              initialValues={{}}
              modelName="machine"
              onSubmit={jest.fn()}
              processingCount={1}
              selectedCount={2}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByTestId(TestIds.SavingLabel).textContent).toBe(
      "Processing 1 of 2 machines..."
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disables the submit button when selectedCount equals 0", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ActionForm
              actionName="action"
              initialValues={{}}
              modelName="machine"
              onSubmit={jest.fn()}
              selectedCount={0}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows correct saving label if selectedCount changes after submit", async () => {
    const store = mockStore(state);
    const Proxy = ({ selectedCount }: { selectedCount: number }) => (
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ActionForm
              actionName="action"
              initialValues={{}}
              modelName="machine"
              onSubmit={jest.fn()}
              processingCount={2}
              selectedCount={selectedCount}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const { rerender } = render(<Proxy selectedCount={2} />);

    // Submit the form to start processing.
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId(TestIds.SavingLabel).textContent).toBe(
      "Processing 0 of 2 machines..."
    );

    // Change the selected count prop - the label should stay the same.
    rerender(<Proxy selectedCount={1} />);

    expect(screen.getByTestId(TestIds.SavingLabel).textContent).toBe(
      "Processing 0 of 2 machines..."
    );
  });

  it("can override showing the processing count", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ActionForm
              actionName="action"
              initialValues={{}}
              modelName="machine"
              onSubmit={jest.fn()}
              processingCount={1}
              selectedCount={2}
              showProcessingCount={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("button"));

    expect(screen.queryByTestId(TestIds.SavingLabel)).not.toBeInTheDocument();
  });
});
