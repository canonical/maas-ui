import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import SubnetsTable from "./SubnetsTable";
import { SUBNETS_TABLE_ITEMS_PER_PAGE } from "./constants";

import urls from "app/subnets/urls";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  vlanState as vlanStateFactory,
  subnetState as subnetStateFactory,
  spaceState as spaceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const getMockState = ({ numberOfFabrics } = { numberOfFabrics: 50 }) => {
  const fabrics = [
    ...new Array(numberOfFabrics)
      .fill(null)
      .map((_value, index) =>
        fabricFactory({ id: index + 1, name: `fabric-${index + 1}` })
      ),
  ];
  return rootStateFactory({
    fabric: fabricStateFactory({
      loaded: true,
      items: fabrics,
    }),
    vlan: vlanStateFactory({ loaded: true }),
    subnet: subnetStateFactory({ loaded: true }),
    space: spaceStateFactory({ loaded: true }),
  });
};

it("renders a single table variant at a time", () => {
  const state = getMockState();
  const mockStore = configureStore();
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <CompatRouter>
          <SubnetsTable
            groupBy="fabric"
            setGroupBy={jest.fn()}
            searchText=""
            setSearchText={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getAllByRole("table")).toHaveLength(1);
});

it("renders Subnets by Fabric table when grouping by Fabric", () => {
  const state = getMockState();
  const mockStore = configureStore();
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <CompatRouter>
          <SubnetsTable
            groupBy="fabric"
            setGroupBy={jest.fn()}
            searchText=""
            setSearchText={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("table", { name: "Subnets by Fabric" })
  ).toBeInTheDocument();
});

it("renders Subnets by Space table when grouping by Space", () => {
  const state = getMockState();
  const mockStore = configureStore();
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <CompatRouter>
          <SubnetsTable
            groupBy="space"
            setGroupBy={jest.fn()}
            searchText=""
            setSearchText={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("table", { name: "Subnets by Space" })
  ).toBeInTheDocument();
});

it("displays a correct number of pages", () => {
  const state = getMockState();
  const mockStore = configureStore();
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <CompatRouter>
          <SubnetsTable
            groupBy="fabric"
            setGroupBy={jest.fn()}
            searchText=""
            setSearchText={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("table", { name: "Subnets by Fabric" })
  ).toBeInTheDocument();

  const numberOfPages =
    state.fabric.items.length / SUBNETS_TABLE_ITEMS_PER_PAGE;
  const numberOfNextAndPrevButtons = 2;
  expect(
    within(screen.getByRole("navigation")).getAllByRole("button")
  ).toHaveLength(numberOfPages + numberOfNextAndPrevButtons);
  expect(
    within(screen.getByRole("navigation")).getByRole("button", { name: "1" })
  ).toBeInTheDocument();
  expect(
    within(screen.getByRole("navigation")).getByRole("button", {
      name: "2",
    })
  ).toBeInTheDocument();
});

it("updates the list of items correctly when navigating to another page", async () => {
  const state = getMockState();
  const mockStore = configureStore();
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <CompatRouter>
          <SubnetsTable
            groupBy="fabric"
            setGroupBy={jest.fn()}
            searchText=""
            setSearchText={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const tableBody = screen.getAllByRole("rowgroup")[1];

  expect(
    within(tableBody).getByRole("link", {
      name: "fabric-1",
    })
  ).toBeInTheDocument();
  expect(
    within(tableBody).getByRole("link", {
      name: "fabric-25",
    })
  ).toBeInTheDocument();
  await waitFor(() =>
    expect(within(tableBody).getAllByRole("row")).toHaveLength(25)
  );

  await userEvent.click(
    within(screen.getByRole("navigation")).getByRole("button", {
      name: "2",
    })
  );
  await waitFor(() =>
    expect(within(tableBody).getAllByRole("row")).toHaveLength(25)
  );
  await waitFor(() =>
    expect(
      within(tableBody).getByRole("link", {
        name: "fabric-26",
      })
    ).toBeInTheDocument()
  );
  expect(
    within(tableBody).getByRole("link", {
      name: "fabric-50",
    })
  ).toBeInTheDocument();
});

it("doesn't display pagination if rows are within items per page limit", () => {
  const numberOfFabrics = 1;
  const state = getMockState({
    numberOfFabrics,
  });
  const mockStore = configureStore();
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <CompatRouter>
          <SubnetsTable
            groupBy="fabric"
            setGroupBy={jest.fn()}
            searchText=""
            setSearchText={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.queryByRole("navigation", { name: "Subnets by Fabric" })
  ).not.toBeInTheDocument();
});

it("displays correctly paginated rows", async () => {
  const numberOfFabrics = SUBNETS_TABLE_ITEMS_PER_PAGE * 2;
  const state = getMockState({
    numberOfFabrics,
  });
  const mockStore = configureStore();
  const store = mockStore(state);
  const firstPageFabrics = state.fabric.items.slice(
    0,
    SUBNETS_TABLE_ITEMS_PER_PAGE
  );
  const secondPageFabrics = state.fabric.items.slice(
    SUBNETS_TABLE_ITEMS_PER_PAGE,
    SUBNETS_TABLE_ITEMS_PER_PAGE * 2
  );

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <CompatRouter>
          <SubnetsTable
            groupBy="fabric"
            setGroupBy={jest.fn()}
            searchText=""
            setSearchText={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const tableBody = screen.getAllByRole("rowgroup")[1];

  expect(within(tableBody).getAllByRole("row")).toHaveLength(
    SUBNETS_TABLE_ITEMS_PER_PAGE
  );

  within(tableBody)
    .getAllByRole("row")
    .forEach((row, index) => {
      expect(row.textContent).toEqual(
        expect.stringContaining(firstPageFabrics[index].name)
      );
    });

  await userEvent.click(
    screen.getByRole("button", {
      name: "Next page",
    })
  );

  await waitFor(() =>
    expect(
      within(screen.getByRole("navigation", { name: "pagination" })).getByRole(
        "button",
        { current: "page" }
      )
    ).toHaveTextContent("2")
  );

  expect(within(tableBody).getAllByRole("row")).toHaveLength(
    SUBNETS_TABLE_ITEMS_PER_PAGE
  );

  within(tableBody)
    .getAllByRole("row")
    .forEach((row, index) => {
      expect(row.textContent).toEqual(
        expect.stringContaining(secondPageFabrics[index].name)
      );
    });
});

it("displays the last available page once the currently active has no items", async () => {
  const numberOfFabrics = SUBNETS_TABLE_ITEMS_PER_PAGE * 3 + 1;
  const state = getMockState({
    numberOfFabrics,
  });
  const mockStore = configureStore();
  const store = mockStore(state);

  const { rerender } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <CompatRouter>
          <SubnetsTable
            groupBy="fabric"
            setGroupBy={jest.fn()}
            searchText=""
            setSearchText={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const tableBody = screen.getAllByRole("rowgroup")[1];

  await userEvent.click(
    within(screen.getByRole("navigation", { name: "pagination" })).getByRole(
      "button",
      {
        name: "4",
      }
    )
  );

  await waitFor(() =>
    expect(within(tableBody).getAllByRole("row")).toHaveLength(1)
  );
  expect(
    within(tableBody).getByRole("link", {
      name: `fabric-${numberOfFabrics}`,
    })
  ).toBeInTheDocument();

  const updatedState = getMockState({
    numberOfFabrics: SUBNETS_TABLE_ITEMS_PER_PAGE * 2,
  });
  const updatedMockStore = configureStore();
  const updatedStore = updatedMockStore(updatedState);
  rerender(
    <Provider store={updatedStore}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <CompatRouter>
          <SubnetsTable
            groupBy="fabric"
            setGroupBy={jest.fn()}
            searchText=""
            setSearchText={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() =>
    expect(
      screen
        .getByRole("navigation", { name: "pagination" })
        // eslint-disable-next-line testing-library/no-node-access
        .querySelector(".is-active")
    ).toHaveTextContent("2")
  );
  expect(within(tableBody).getAllByRole("row")).toHaveLength(
    SUBNETS_TABLE_ITEMS_PER_PAGE
  );
});

it("remains on the same page once the data is updated and page is still available", async () => {
  const numberOfFabrics = SUBNETS_TABLE_ITEMS_PER_PAGE * 2;
  const state = getMockState({
    numberOfFabrics,
  });
  const mockStore = configureStore();
  const store = mockStore(state);

  const { rerender } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <CompatRouter>
          <SubnetsTable
            groupBy="fabric"
            setGroupBy={jest.fn()}
            searchText=""
            setSearchText={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  const pagination = screen.getByRole("navigation", { name: "pagination" });
  await userEvent.click(
    within(pagination).getByRole("button", {
      name: "2",
    })
  );

  await waitFor(() =>
    expect(
      screen
        .getByRole("navigation")
        // eslint-disable-next-line testing-library/no-node-access
        .querySelector(".is-active")
    ).toHaveTextContent("2")
  );

  const updatedState = getMockState({
    numberOfFabrics: SUBNETS_TABLE_ITEMS_PER_PAGE * 2,
  });
  const updatedMockStore = configureStore();
  const updatedStore = updatedMockStore(updatedState);
  rerender(
    <Provider store={updatedStore}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <CompatRouter>
          <SubnetsTable
            groupBy="fabric"
            setGroupBy={jest.fn()}
            searchText=""
            setSearchText={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() =>
    expect(
      screen
        .getByRole("navigation")
        // eslint-disable-next-line testing-library/no-node-access
        .querySelector(".is-active")
    ).toHaveTextContent("2")
  );
});
