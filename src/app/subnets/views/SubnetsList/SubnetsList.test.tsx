import SubnetsList from "./SubnetsList";

import urls from "@/app/subnets/urls";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  within,
  waitFor,
  getUrlParam,
  renderWithBrowserRouter,
} from "@/testing/utils";

const getMockState = () => {
  return factory.rootState({
    fabric: factory.fabricState({
      loaded: true,
    }),
    vlan: factory.vlanState({ loaded: true }),
    subnet: factory.subnetState({ loaded: true }),
    space: factory.spaceState({ loaded: true }),
  });
};

it("displays loading text", async () => {
  const state = getMockState();
  state.fabric.loaded = false;
  renderWithBrowserRouter(<SubnetsList />, {
    state,
    route: urls.index,
  });

  expect(screen.getAllByRole("grid")).toHaveLength(1);
  await userEvent.type(screen.getByRole("searchbox"), "non-existent-fabric");
  await waitFor(() => {
    expect(screen.getByText(/Loading.../)).toBeInTheDocument();
  });
});

it("displays correct text when there are no results for the search criteria", async () => {
  const state = getMockState();
  renderWithBrowserRouter(<SubnetsList />, {
    state,
    route: urls.index,
  });

  expect(screen.getAllByRole("grid")).toHaveLength(1);

  await userEvent.type(screen.getByRole("searchbox"), "non-existent-fabric");

  await waitFor(() => {
    expect(
      within(screen.getByRole("grid")).getByText(/No results/)
    ).toBeInTheDocument();
  });
});

it("sets the options from the URL on load", async () => {
  const state = getMockState();
  renderWithBrowserRouter(<SubnetsList />, {
    state,
    route: urls.indexWithParams({ by: "space", q: "fabric-1" }),
  });

  await waitFor(() => {
    expect(
      screen.getByRole("combobox", {
        name: /group by/i,
      })
    ).toHaveValue("space");
  });

  await waitFor(() => {
    expect(screen.getByRole<HTMLInputElement>("searchbox").value).toBe(
      "fabric-1"
    );
  });
});

it("updates the URL on search", async () => {
  const state = getMockState();
  renderWithBrowserRouter(<SubnetsList />, {
    state,
    route: urls.index,
  });

  expect(getUrlParam("q")).toEqual("");

  await userEvent.type(screen.getByRole("searchbox"), "test-fabric");

  await waitFor(() => {
    expect(getUrlParam("q")).toEqual("test-fabric");
  });
});

it("updates the URL 'by' param once a new group by option is selected", async () => {
  const state = getMockState();
  renderWithBrowserRouter(<SubnetsList />, {
    state,
    route: urls.index,
  });

  expect(getUrlParam("by")).toEqual("fabric");

  const selectBox = screen.getByRole("combobox", {
    name: /group by/i,
  });

  await userEvent.selectOptions(selectBox, "space");

  await waitFor(() => {
    expect(getUrlParam("by")).toEqual("space");
  });
});
