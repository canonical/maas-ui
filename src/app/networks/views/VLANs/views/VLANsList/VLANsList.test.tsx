import VLANsList from "./VLANsList";

import { DeleteVLAN } from "@/app/networks/views/VLANs/components";
import type { RootState } from "@/app/store/root/types";
import {
  rootState as rootStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  mockModal,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);
const { mockOpen } = await mockModal();

describe("VLANsList", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      vlan: vlanStateFactory({
        loading: false,
        loaded: true,
        items: [vlanFactory()],
      }),
    });
  });

  it("uses the correct window title", async () => {
    renderWithProviders(<VLANsList />, { state });

    expect(document.title).toBe("VLANs | MAAS");
  });

  it("renders the VLANs table", () => {
    renderWithProviders(<VLANsList />, { state });

    expect(
      screen.getByRole("treegrid", { name: "VLANs table" })
    ).toBeInTheDocument();
  });

  it("renders the EditVLAN form", async () => {
    renderWithProviders(<VLANsList />, { state });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Edit" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(
      screen.getByRole("complementary", { name: "Edit VLAN" })
    ).toBeInTheDocument();
  });

  it("renders the DeleteVLAN form", async () => {
    renderWithProviders(<VLANsList />, { state });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Delete" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mockOpen).toHaveBeenCalledWith({
      component: DeleteVLAN,
      title: "Delete VLAN",
      props: {
        id: state.vlan.items[0].id,
      },
    });
  });
});
