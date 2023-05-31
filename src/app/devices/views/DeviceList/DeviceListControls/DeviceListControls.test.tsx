import DeviceListControls from "./DeviceListControls";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

describe("DeviceListControls", () => {
  let state: RootState = rootStateFactory();

  it("changes the search text when the filters change", () => {
    const { rerender } = renderWithBrowserRouter(
      <DeviceListControls filter={""} setFilter={jest.fn()} />,
      { route: "/machines?q=test+search", state }
    );
    expect(screen.getByRole("searchbox")).toHaveValue("");

    rerender(<DeviceListControls filter={"free-text"} setFilter={jest.fn()} />);

    expect(screen.getByRole("searchbox")).toHaveValue("free-text");
  });
});
