import VirshDetailsActionMenu from "./VirshDetailsActionMenu";

import ComposeForm from "@/app/kvm/components/ComposeForm";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  userEvent,
  screen,
  renderWithProviders,
  setupMockServer,
  waitFor,
  mockSidePanel,
} from "@/testing/utils";

const { mockOpen } = await mockSidePanel();
const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

describe("VirshDetailsActionMenu", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      pod: factory.podState({
        loaded: true,
        items: [factory.pod({ id: 1 })],
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("can open the compose form", async () => {
    renderWithProviders(<VirshDetailsActionMenu hostId={1} />, { state });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Take action" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Take action" }));
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Compose" })
    );

    expect(mockOpen).toHaveBeenCalledWith({
      component: ComposeForm,
      title: "Compose",
      props: { hostId: 1 },
    });
  });

  it("disables the take action dropdown without the edit machines entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<VirshDetailsActionMenu hostId={1} />, { state });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Take action" })
      ).toBeAriaDisabled();
    });
  });
});
