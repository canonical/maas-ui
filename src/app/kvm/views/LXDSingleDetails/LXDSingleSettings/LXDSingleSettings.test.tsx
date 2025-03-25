import { screen } from "@testing-library/react";

import LXDSingleSettings from "./LXDSingleSettings";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter } from "@/testing/utils";

describe("LXDSingleSettings", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      pod: factory.podState({
        items: [factory.podDetails({ id: 1, name: "pod1" })],
        loaded: true,
      }),
      tag: factory.tagState({
        loaded: true,
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const { store } = renderWithBrowserRouter(
      <LXDSingleSettings id={1} setSidePanelContent={vi.fn()} />,
      { state }
    );
    const expectedActionTypes = [
      "resourcepool/fetch",
      "tag/fetch",
      "zone/fetch",
    ];
    const actualActions = store.getActions();
    expectedActionTypes.forEach((expectedActionType) => {
      expect(
        actualActions.some(
          (actualAction) => actualAction.type === expectedActionType
        )
      );
    });
  });

  it("displays a spinner if data has not loaded", () => {
    renderWithBrowserRouter(
      <LXDSingleSettings id={1} setSidePanelContent={vi.fn()} />,
      { state }
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
