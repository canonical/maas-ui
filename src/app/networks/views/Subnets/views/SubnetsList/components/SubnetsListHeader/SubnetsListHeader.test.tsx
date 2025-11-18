import SubnetsListHeader from "./SubnetsListHeader";

import {
  AddFabric,
  AddSpace,
  AddSubnet,
  AddVlan,
} from "@/app/networks/components";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  userEvent,
} from "@/testing/utils";

const { mockOpen } = await mockSidePanel();

describe("SubnetListHeader", () => {
  it("displays the form when Add->Fabric is clicked", async () => {
    renderWithProviders(
      <SubnetsListHeader grouping={""} searchText={""} setSearchText={vi.fn} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    await userEvent.click(screen.getByRole("button", { name: "Fabric" }));

    expect(mockOpen).toHaveBeenCalledWith({
      component: AddFabric,
      title: "Add fabric",
    });
  });

  it("displays the form when Add->VLAN is clicked", async () => {
    renderWithProviders(
      <SubnetsListHeader grouping={""} searchText={""} setSearchText={vi.fn} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    await userEvent.click(screen.getByRole("button", { name: "VLAN" }));

    expect(mockOpen).toHaveBeenCalledWith({
      component: AddVlan,
      title: "Add VLAN",
    });
  });

  it("displays the form when Add->Space is clicked", async () => {
    renderWithProviders(
      <SubnetsListHeader grouping={""} searchText={""} setSearchText={vi.fn} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    await userEvent.click(screen.getByRole("button", { name: "Space" }));

    expect(mockOpen).toHaveBeenCalledWith({
      component: AddSpace,
      title: "Add space",
    });
  });

  it("displays the form when Add->Subnet is clicked", async () => {
    renderWithProviders(
      <SubnetsListHeader grouping={""} searchText={""} setSearchText={vi.fn} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    await userEvent.click(screen.getByRole("button", { name: "Subnet" }));

    expect(mockOpen).toHaveBeenCalledWith({
      component: AddSubnet,
      title: "Add subnet",
    });
  });
});
