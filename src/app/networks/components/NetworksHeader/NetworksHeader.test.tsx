import { Input } from "@canonical/react-components";

import { AddFabric, AddSpace, AddSubnet, AddVlan } from "../../components";

import NetworksHeader from "./NetworksHeader";

import { authResolvers } from "@/testing/resolvers/auth";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);
const { mockOpen } = await mockSidePanel();

describe("NetworksHeader", () => {
  describe("display", () => {
    it("renders controls passed in as a prop", () => {
      renderWithProviders(
        <NetworksHeader controls={<Input aria-label="search" type="text" />} />
      );

      expect(
        screen.getByRole("textbox", { name: "search" })
      ).toBeInTheDocument();
    });

    [
      { pathname: "/networks/subnets", title: "Subnets" },
      { pathname: "/networks/vlans", title: "VLANs" },
      { pathname: "/networks/fabrics", title: "Fabrics" },
      { pathname: "/networks/spaces", title: "Spaces" },
      { pathname: "/networks", title: "Networks" },
    ].forEach(({ pathname, title }) => {
      it(`shows the "${title}" title at ${pathname}`, () => {
        renderWithProviders(<NetworksHeader />, {
          initialEntries: [pathname],
        });

        expect(
          screen.getByRole("heading", { name: title })
        ).toBeInTheDocument();
      });
    });
  });

  describe("actions", () => {
    it("displays the form when Add->Fabric is clicked", async () => {
      renderWithProviders(<NetworksHeader />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Add" })
        ).not.toBeAriaDisabled();
      });
      await userEvent.click(screen.getByRole("button", { name: "Add" }));
      await userEvent.click(screen.getByRole("menuitem", { name: "Fabric" }));

      expect(mockOpen).toHaveBeenCalledWith({
        component: AddFabric,
        title: "Add fabric",
      });
    });

    it("displays the form when Add->VLAN is clicked", async () => {
      renderWithProviders(<NetworksHeader />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Add" })
        ).not.toBeAriaDisabled();
      });
      await userEvent.click(screen.getByRole("button", { name: "Add" }));
      await userEvent.click(screen.getByRole("menuitem", { name: "VLAN" }));

      expect(mockOpen).toHaveBeenCalledWith({
        component: AddVlan,
        title: "Add VLAN",
      });
    });

    it("displays the form when Add->Space is clicked", async () => {
      renderWithProviders(<NetworksHeader />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Add" })
        ).not.toBeAriaDisabled();
      });
      await userEvent.click(screen.getByRole("button", { name: "Add" }));
      await userEvent.click(screen.getByRole("menuitem", { name: "Space" }));

      expect(mockOpen).toHaveBeenCalledWith({
        component: AddSpace,
        title: "Add space",
      });
    });

    it("displays the form when Add->Subnet is clicked", async () => {
      renderWithProviders(<NetworksHeader />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Add" })
        ).not.toBeAriaDisabled();
      });
      await userEvent.click(screen.getByRole("button", { name: "Add" }));
      await userEvent.click(screen.getByRole("menuitem", { name: "Subnet" }));

      expect(mockOpen).toHaveBeenCalledWith({
        component: AddSubnet,
        title: "Add subnet",
      });
    });

    it("disables the Add button without the edit entitlement", async () => {
      mockServer.use(authResolvers.getMeEntitlements.handler([]));
      renderWithProviders(<NetworksHeader />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Add" })).toBeAriaDisabled();
      });
    });
  });
});
