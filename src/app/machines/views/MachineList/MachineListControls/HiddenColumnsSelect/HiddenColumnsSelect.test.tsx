import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import HiddenColumnsSelect from "./HiddenColumnsSelect";

import { columnToggles } from "app/machines/constants";
import { rootState as rootStateFactory } from "testing/factories";

it("calls setHiddenColumns correctly on click of a checkbox", async () => {
  const mockStore = configureStore();
  const hiddenColumns: Array<""> = [];
  const store = mockStore(rootStateFactory());

  const setHiddenColumns = jest.fn();
  render(
    <Provider store={store}>
      <HiddenColumnsSelect
        hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
      />
    </Provider>
  );
  await userEvent.click(screen.getByRole("button", { name: "Columns" }));
  expect(
    screen.getByRole("checkbox", { name: /10 out of 10 selected/ })
  ).toBeInTheDocument();
  await userEvent.click(screen.getByRole("checkbox", { name: "RAM" }));
  expect(setHiddenColumns).toHaveBeenCalledWith(["memory"]);
});

it("displays a correct number of selected columns", async () => {
  const mockStore = configureStore();
  const hiddenColumns = ["memory"];
  const store = mockStore(rootStateFactory());

  const setHiddenColumns = jest.fn();
  render(
    <Provider store={store}>
      <HiddenColumnsSelect
        hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
      />
    </Provider>
  );
  await userEvent.click(screen.getByRole("button", { name: "Columns" }));
  expect(
    screen.getByRole("checkbox", { name: /9 out of 10 selected/ })
  ).toBeInTheDocument();
  await userEvent.click(screen.getByRole("checkbox", { name: "RAM" }));
  expect(setHiddenColumns).toHaveBeenCalledWith([]);
});

it("group checkbox selects all columns on press", async () => {
  const mockStore = configureStore();
  const hiddenColumns: string[] = [];
  const store = mockStore(rootStateFactory());

  const setHiddenColumns = jest.fn();
  render(
    <Provider store={store}>
      <HiddenColumnsSelect
        hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
      />
    </Provider>
  );
  await userEvent.click(screen.getByRole("button", { name: "Columns" }));
  await userEvent.click(
    screen.getByRole("checkbox", { name: /10 out of 10 selected/ })
  );
  expect(setHiddenColumns).toHaveBeenCalledWith([...columnToggles]);
});
