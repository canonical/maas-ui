import SettingsTable from "./SettingsTable";

import { screen, renderWithBrowserRouter } from "testing/utils";

describe("SettingsTable", () => {
  it("can render", () => {
    renderWithBrowserRouter(
      <SettingsTable
        buttons={[
          { label: "Add PPA", url: "/settings/repositories/add/ppa" },
          {
            label: "Add repository",
            url: "/settings/repositories/add/repository",
          },
        ]}
        loaded={true}
        loading={false}
        searchOnChange={jest.fn()}
        searchPlaceholder="Search"
        searchText=""
      />,
      {}
    );

    expect(screen.getByRole("link", { name: "Add PPA" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Add repository" })
    ).toBeInTheDocument();
  });

  it("can show the loading state", () => {
    renderWithBrowserRouter(
      <SettingsTable
        buttons={[
          { label: "Add PPA", url: "/settings/repositories/add/ppa" },
          {
            label: "Add repository",
            url: "/settings/repositories/add/repository",
          },
        ]}
        loaded={false}
        loading={true}
      />,
      {}
    );

    const loadingSpinner = screen.getByText("Loading");
    expect(loadingSpinner).toBeInTheDocument();
    expect(loadingSpinner.classList.contains("p-icon--spinner")).toBe(true);
    expect(loadingSpinner.classList.contains("u-animation--spin")).toBe(true);
  });

  it("can display without search", () => {
    renderWithBrowserRouter(
      <SettingsTable
        buttons={[
          { label: "Add PPA", url: "/settings/repositories/add/ppa" },
          {
            label: "Add repository",
            url: "/settings/repositories/add/repository",
          },
        ]}
        loaded={false}
        loading={true}
      />,
      {}
    );

    expect(screen.queryByText("Search")).not.toBeInTheDocument();
  });
});

it("can render a disabled button ", () => {
  renderWithBrowserRouter(
    <SettingsTable
      buttons={[{ label: "Add User", url: "/foo", disabled: true }]}
      loaded={false}
      loading={true}
    />,
    {}
  );

  const button = screen.getByRole("link", { name: "Add User" });
  expect(button).toBeInTheDocument();
  expect(button.classList.contains("is-disabled")).toBe(true);
});

it("can render a button with a tooltip", () => {
  const tooltip = "Add a user to MAAS";
  renderWithBrowserRouter(
    <SettingsTable
      buttons={[{ label: "Add User", url: "/foo", tooltip }]}
      loaded={false}
      loading={true}
    />,
    {}
  );

  expect(screen.getByRole("tooltip")).toHaveTextContent(tooltip);
});
