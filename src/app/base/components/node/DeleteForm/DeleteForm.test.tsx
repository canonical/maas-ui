import configureStore from "redux-mock-store";

import DeleteForm from "./DeleteForm";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("DeleteForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState();
  });

  it("correctly runs function to delete given nodes", async () => {
    const onSubmit = vi.fn();
    const nodes = [
      factory.machine({ system_id: "abc123" }),
      factory.machine({ system_id: "def456" }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeleteForm
        clearSidePanelContent={vi.fn()}
        modelName="machine"
        nodes={nodes}
        onSubmit={onSubmit}
        processingCount={0}
        redirectURL="/redirect"
        viewingDetails={false}
      />,
      { store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Delete 2 machines" })
    );
    expect(onSubmit).toHaveBeenCalledWith(
      {},
      expect.objectContaining({ resetForm: expect.any(Function) })
    );
  });

  it("redirects when a node is deleted from details view", () => {
    const nodes = [factory.machine({ system_id: "abc123" })];
    const store = mockStore(state);
    const Proxy = ({
      processingCount,
    }: {
      readonly processingCount: number;
    }) => (
      <DeleteForm
        clearSidePanelContent={vi.fn()}
        modelName="machine"
        nodes={nodes}
        onSubmit={vi.fn()}
        processingCount={processingCount}
        redirectURL="/redirect"
        viewingDetails
      />
    );
    const { rerender } = renderWithBrowserRouter(
      <Proxy processingCount={1} />,
      { route: "/", store }
    );

    rerender(<Proxy processingCount={0} />);

    expect(window.location.pathname).toBe("/redirect");
  });

  it("does not redirect from details view if there are errors", () => {
    const nodes = [factory.machine({ system_id: "abc123" })];
    const store = mockStore(state);
    const Proxy = ({
      errors,
      processingCount,
    }: {
      readonly errors: string | null;
      readonly processingCount: number;
    }) => (
      <DeleteForm
        clearSidePanelContent={vi.fn()}
        errors={errors}
        modelName="machine"
        nodes={nodes}
        onSubmit={vi.fn()}
        processingCount={processingCount}
        redirectURL="/redirect"
        viewingDetails
      />
    );
    const { rerender } = renderWithBrowserRouter(
      <Proxy errors={null} processingCount={1} />,
      { route: "/", store }
    );

    rerender(<Proxy errors={"It didn't work"} processingCount={0} />);
    expect(window.location.pathname).toBe("/");
  });
});
