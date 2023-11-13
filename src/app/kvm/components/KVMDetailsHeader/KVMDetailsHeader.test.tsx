import KVMDetailsHeader from "./KVMDetailsHeader";

import urls from "@/app/base/urls";
import { screen, getTestState, renderWithBrowserRouter } from "testing/utils";

describe("KVMDetailsHeader", () => {
  let state: ReturnType<typeof getTestState>;

  beforeEach(() => {
    state = getTestState();
  });

  it("renders extra title blocks", () => {
    renderWithBrowserRouter(
      <KVMDetailsHeader
        setSidePanelContent={vi.fn()}
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
});
