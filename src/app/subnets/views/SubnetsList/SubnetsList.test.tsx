import userEvent from "@testing-library/user-event";

import SubnetsList from "./SubnetsList";

import urls from "app/subnets/urls";
import {
  fabricState as fabricStateFactory,
  vlanState as vlanStateFactory,
  subnetState as subnetStateFactory,
  spaceState as spaceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import {
  screen,
  within,
  waitFor,
  getUrlParam,
  renderWithBrowserRouter,
} from "testing/utils";

const getMockState = () => {
  return rootStateFactory({
    fabric: fabricStateFactory({
      loaded: true,
    }),
    vlan: vlanStateFactory({ loaded: true }),
    subnet: subnetStateFactory({ loaded: true }),
    space: spaceStateFactory({ loaded: true }),
  });
};

it("displays loading text", async () => {
  const state = getMockState();
  state.fabric.loaded = false;
  renderWithBrowserRouter(<SubnetsList />, {
    state,
    route: urls.index,
  });

  expect(screen.getAllByRole("table")).toHaveLength(1);
  await userEvent.type(screen.getByRole("searchbox"), "non-existent-fabric");
  await waitFor(() =>
    expect(screen.getByText(/Loading.../)).toBeInTheDocument()
  );
});

it("displays correct text when there are no results for the search criteria", async () => {
  const state = getMockState();
  renderWithBrowserRouter(<SubnetsList />, {
    state,
    route: urls.index,
  });

  expect(screen.getAllByRole("table")).toHaveLength(1);
  const tableBody = screen.getAllByRole("rowgroup")[1];

  await userEvent.type(screen.getByRole("searchbox"), "non-existent-fabric");

  await waitFor(() =>
    expect(within(tableBody).getByText(/No results/)).toBeInTheDocument()
  );
  expect(within(tableBody).getAllByRole("row")).toHaveLength(1);
});

it("sets the options from the URL on load", async () => {
  const state = getMockState();
  renderWithBrowserRouter(<SubnetsList />, {
    state,
    route: urls.indexWithParams({ by: "space", q: "fabric-1" }),
  });

  await waitFor(() =>
    expect(
      screen.getByRole<HTMLOptionElement>("option", { name: "Group by space" })
        .selected
    ).toBe(true)
  );
  await waitFor(() =>
    expect(screen.getByRole<HTMLInputElement>("searchbox").value).toBe(
      "fabric-1"
    )
  );
});

it("updates the URL on search", async () => {
  const state = getMockState();
  renderWithBrowserRouter(<SubnetsList />, {
    state,
    route: urls.index,
  });

  expect(getUrlParam("q")).toEqual("");

  await userEvent.type(screen.getByRole("searchbox"), "test-fabric");

  await waitFor(() => expect(getUrlParam("q")).toEqual("test-fabric"));
});

it("updates the URL 'by' param once a new group by option is selected", async () => {
  const state = getMockState();
  renderWithBrowserRouter(<SubnetsList />, {
    state,
    route: urls.index,
  });

  expect(getUrlParam("by")).toEqual("fabric");

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Group by" }),
    "Group by space"
  );

  await waitFor(() => expect(getUrlParam("by")).toEqual("space"));
});
