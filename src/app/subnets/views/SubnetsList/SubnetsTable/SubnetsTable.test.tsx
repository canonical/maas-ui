import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import SubnetsTable from "./SubnetsTable";
import { SUBNETS_TABLE_ITEMS_PER_PAGE } from "./constants";

import urls from "@/app/subnets/urls";
import * as factory from "@/testing/factories";
import {
  userEvent,
  render,
  screen,
  within,
  renderWithBrowserRouter,
  waitFor,
} from "@/testing/utils";

const getMockState = ({ numberOfFabrics } = { numberOfFabrics: 50 }) => {
  const fabrics = [
    ...new Array(numberOfFabrics)
      .fill(null)
      .map((_value, index) =>
        factory.fabric({ id: index + 1, name: `fabric-${index + 1}` })
      ),
  ];
  return factory.rootState({
    fabric: factory.fabricState({
      loaded: true,
      items: fabrics,
    }),
    vlan: factory.vlanState({ loaded: true }),
    subnet: factory.subnetState({ loaded: true }),
    space: factory.spaceState({ loaded: true }),
  });
};

it("renders a single table variant at a time", () => {
  const state = getMockState();
  const mockStore = configureStore();
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <SubnetsTable groupBy="fabric" searchText="" />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getAllByRole("grid")).toHaveLength(1);
});

it("renders Subnets by Fabric table when grouping by Fabric", () => {
  const state = getMockState();
  const mockStore = configureStore();
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <SubnetsTable groupBy="fabric" searchText="" />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("grid", { name: "Subnets by Fabric" })
  ).toBeInTheDocument();
});

it("renders Subnets by Space table when grouping by Space", () => {
  const state = getMockState();
  const mockStore = configureStore();
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <SubnetsTable groupBy="space" searchText="" />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("grid", { name: "Subnets by Space" })
  ).toBeInTheDocument();
});

it("displays a correct number of pages", () => {
  const state = getMockState();
  const mockStore = configureStore();
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <SubnetsTable groupBy="fabric" searchText="" />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("grid", { name: "Subnets by Fabric" })
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
        <SubnetsTable groupBy="fabric" searchText="" />
      </MemoryRouter>
    </Provider>
  );
  const tableBody = screen.getAllByRole("rowgroup")[1];

  expect(
    within(tableBody).getByRole("link", { name: "fabric-1" })
  ).toBeInTheDocument();

  await userEvent.click(
    within(screen.getByRole("navigation")).getByRole("button", {
      name: "2",
    })
  );
  await waitFor(() =>
    expect(
      within(tableBody).getAllByRole("link", { name: /fabric/i })
    ).toHaveLength(25)
  );
  await waitFor(() =>
    expect(
      within(tableBody).getByRole("link", { name: "fabric-26" })
    ).toBeInTheDocument()
  );
  expect(
    within(tableBody).getByRole("link", { name: "fabric-50" })
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
        <SubnetsTable groupBy="fabric" searchText="" />
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

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <SubnetsTable groupBy="fabric" searchText="" />
      </MemoryRouter>
    </Provider>
  );
  const tableBody = screen.getAllByRole("rowgroup")[1];

  // Get grouped rows
  const groupRows = screen.getAllByRole("row", { name: /group/i });
  expect(within(tableBody).getAllByRole("row")).toHaveLength(
    SUBNETS_TABLE_ITEMS_PER_PAGE + groupRows.length
  );

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

  expect(
    within(tableBody).getAllByRole("link", { name: /fabric/i })
  ).toHaveLength(SUBNETS_TABLE_ITEMS_PER_PAGE);
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
        <SubnetsTable groupBy="fabric" searchText="" />
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
    expect(within(tableBody).getAllByRole("row")).toHaveLength(2)
  );
  expect(
    within(tableBody).getByRole("link", { name: `fabric-${numberOfFabrics}` })
  ).toBeInTheDocument();

  const updatedState = getMockState({
    numberOfFabrics: SUBNETS_TABLE_ITEMS_PER_PAGE * 2,
  });
  const updatedMockStore = configureStore();
  const updatedStore = updatedMockStore(updatedState);
  rerender(
    <Provider store={updatedStore}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <SubnetsTable groupBy="fabric" searchText="" />
      </MemoryRouter>
    </Provider>
  );

  const pagination = screen.getByRole("navigation", { name: "pagination" });
  await waitFor(() =>
    expect(
      within(pagination).getByRole("button", { name: "2" })
    ).toHaveAttribute("aria-current", "page")
  );

  expect(within(tableBody).getAllByRole("row")).toHaveLength(2);
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
        <SubnetsTable groupBy="fabric" searchText="" />
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
      within(pagination).getByRole("button", { name: "2" })
    ).toHaveAttribute("aria-current", "page")
  );

  const updatedState = getMockState({
    numberOfFabrics: SUBNETS_TABLE_ITEMS_PER_PAGE * 2,
  });
  const updatedMockStore = configureStore();
  const updatedStore = updatedMockStore(updatedState);
  rerender(
    <Provider store={updatedStore}>
      <MemoryRouter initialEntries={[{ pathname: urls.index }]}>
        <SubnetsTable groupBy="fabric" searchText="" />
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() =>
    expect(
      within(pagination).getByRole("button", { name: "2" })
    ).toHaveAttribute("aria-current", "page")
  );
});

it("displays the table group summary at the top of every page", async () => {
  const numberOfFabrics = SUBNETS_TABLE_ITEMS_PER_PAGE * 2;
  const state = getMockState({
    numberOfFabrics,
  });

  renderWithBrowserRouter(<SubnetsTable groupBy="fabric" searchText="" />, {
    route: urls.index,
    state,
  });

  const tableBody = screen.getAllByRole("rowgroup")[1];
  expect(within(tableBody).getAllByRole("row")[0]).toHaveTextContent("network");

  const pagination = screen.getByRole("navigation", { name: "pagination" });
  await userEvent.click(
    within(pagination).getByRole("button", {
      name: "2",
    })
  );

  await waitFor(() =>
    expect(
      within(pagination).getByRole("button", { name: "2" })
    ).toHaveAttribute("aria-current", "page")
  );

  const tableBody2 = screen.getAllByRole("rowgroup")[1];
  expect(within(tableBody2).getAllByRole("row")[0]).toHaveTextContent(
    "network"
  );
});
