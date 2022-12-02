import { screen } from "@testing-library/react";

import KVMDetailsHeader from "./KVMDetailsHeader";

import urls from "app/base/urls";
import { KVMHeaderViews } from "app/kvm/constants";
import { getTestState, renderWithBrowserRouter } from "testing/utils";

describe("KVMDetailsHeader", () => {
  let state: ReturnType<typeof getTestState>;

  beforeEach(() => {
    state = getTestState();
  });

  it("renders header forms and no extra title blocks if header content has been selected", () => {
    renderWithBrowserRouter(
      <KVMDetailsHeader
        headerContent={{
          view: KVMHeaderViews.COMPOSE_VM,
          extras: { hostId: 1 },
        }}
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
        tabLinks={[]}
        title="Title"
        titleBlocks={[{ title: "Title", subtitle: "Subtitle" }]}
      />,
      {
        route: "/kvm/1",
        routePattern: `${urls.kvm.index}/*`,
        state,
      }
    );
    expect(
      screen.getByRole("form", { name: /Compose VM/i })
    ).toBeInTheDocument();
    expect(screen.queryByTestId("extra-title-block")).not.toBeInTheDocument();
  });

  it("renders extra title blocks if no header content has been selected", () => {
    renderWithBrowserRouter(
      <KVMDetailsHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
        tabLinks={[]}
        title="Title"
        titleBlocks={[{ title: "Title", subtitle: "Subtitle" }]}
      />,
      {
        route: "/kvm/1",
        routePattern: `${urls.kvm.index}/*`,
        state,
      }
    );

    expect(
      screen.queryByRole("form", { name: /Compose VM/i })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("extra-title-block")).toBeInTheDocument();
  });
});
