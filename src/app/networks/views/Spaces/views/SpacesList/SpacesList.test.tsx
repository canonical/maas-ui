import SpacesList from "./SpacesList";

import { DeleteSpace } from "@/app/networks/views/Spaces/components";
import { authResolvers } from "@/testing/resolvers/auth";
import { mockSpaces, spacesResolvers } from "@/testing/resolvers/spaces";
import {
  mockModal,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  spacesResolvers.listSpaces.handler(),
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);
const { mockOpen } = await mockModal();

describe("SpacesList", () => {
  it("uses the correct window title", async () => {
    renderWithProviders(<SpacesList />);

    expect(document.title).toBe("Spaces | MAAS");
  });

  it("renders the Spaces table", () => {
    renderWithProviders(<SpacesList />);

    expect(
      screen.getByRole("treegrid", { name: "Spaces table" })
    ).toBeInTheDocument();
  });

  it("renders the DeleteSpace form", async () => {
    renderWithProviders(<SpacesList />);

    await waitFor(() => {
      expect(
        screen.getByText(`${mockSpaces.items[0].name}`)
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

    expect(mockOpen).toHaveBeenCalledWith({
      component: DeleteSpace,
      title: "Delete space",
      props: {
        id: mockSpaces.items[0].id,
      },
    });
  });
});
