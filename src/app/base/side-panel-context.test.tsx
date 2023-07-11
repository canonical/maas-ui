import SidePanelContextProvider, { useSidePanel } from "./side-panel-context";

import { renderHook, act } from "testing/utils";

it("resets side panel size on close", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SidePanelContextProvider>{children}</SidePanelContextProvider>
  );

  const { result } = renderHook(() => useSidePanel(), { wrapper });

  act(() => {
    result.current.setSidePanelSize("large");
  });

  expect(result.current.sidePanelSize).toBe("large");

  act(() => {
    result.current.setSidePanelContent(null);
  });

  expect(result.current.sidePanelSize).toBe("regular");
  expect(result.current.sidePanelContent).toBeNull();
});
