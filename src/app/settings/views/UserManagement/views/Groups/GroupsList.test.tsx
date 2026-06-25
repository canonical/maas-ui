import GroupsList from "./GroupsList";

import { authResolvers } from "@/testing/resolvers/auth";
import { groupsResolvers } from "@/testing/resolvers/groups";
import {
  renderWithProviders,
  setupMockServer,
  userEvent,
  screen,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  groupsResolvers.listGroups.handler(),
  groupsResolvers.listGroupsStatistics.handler(),
  authResolvers.getCurrentUser.handler()
);
describe("GroupsList", () => {
  it("renders AddGroup", async () => {
    renderWithProviders(<GroupsList />);
    expect(
      await screen.findByRole("button", { name: "Add group" })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add group" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Add group" }));
    expect(
      screen.getByRole("complementary", { name: "Add group" })
    ).toBeInTheDocument();
  });
});
