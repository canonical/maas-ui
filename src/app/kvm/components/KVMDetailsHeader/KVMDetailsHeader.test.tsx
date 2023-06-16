import KVMDetailsHeader from "./KVMDetailsHeader";

import urls from "app/base/urls";
import { screen, getTestState, renderWithBrowserRouter } from "testing/utils";

describe("KVMDetailsHeader", () => {
  let state: ReturnType<typeof getTestState>;

  beforeEach(() => {
    state = getTestState();
  });

  it("renders header forms with extra title blocks if header content has been selected", () => {
    renderWithBrowserRouter(
      <KVMDetailsHeader
        setSidePanelContent={jest.fn()}
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
    expect(screen.getByTestId("extra-title-block")).toBeInTheDocument();
  });

  it("renders extra title blocks if no header content has been selected", () => {
    renderWithBrowserRouter(
      <KVMDetailsHeader
        setSidePanelContent={jest.fn()}
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
