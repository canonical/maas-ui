import KVMDetailsHeader from "./KVMDetailsHeader";

import urls from "app/base/urls";
import { KVMHeaderViews } from "app/kvm/constants";
import { screen, getTestState, renderWithBrowserRouter } from "testing/utils";

describe("KVMDetailsHeader", () => {
  let state: ReturnType<typeof getTestState>;

  beforeEach(() => {
    state = getTestState();
  });

  it("renders header forms with extra title blocks if header content has been selected", () => {
    renderWithBrowserRouter(
      <KVMDetailsHeader
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
        sidePanelContent={{
          view: KVMHeaderViews.COMPOSE_VM,
          extras: { hostId: 1 },
        }}
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
    expect(screen.getByTestId("extra-title-block")).toBeInTheDocument();
  });

  it("renders extra title blocks if no header content has been selected", () => {
    renderWithBrowserRouter(
      <KVMDetailsHeader
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
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
