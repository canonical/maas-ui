import SubnetDetailsHeader from "./SubnetDetailsHeader";

import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  userEvent,
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

it("shows the subnet name as the section title", () => {
  const subnet = factory.subnet({ id: 1, name: "subnet-1" });
  renderWithProviders(<SubnetDetailsHeader subnet={subnet} />);

  expect(screen.getByTestId("section-header-title")).toHaveTextContent(
    "subnet-1"
  );
});

it("shows a spinner subtitle if the subnet is loading details", () => {
  const subnet = factory.subnet({ id: 1, name: "subnet-1" });
  renderWithProviders(<SubnetDetailsHeader subnet={subnet} />);

  expect(
    screen.getByTestId("section-header-subtitle-spinner")
  ).toBeInTheDocument();
});

it("does not show a spinner subtitle if the subnet is detailed", () => {
  const subnet = factory.subnetDetails({ id: 1, name: "subnet-1" });
  renderWithProviders(<SubnetDetailsHeader subnet={subnet} />);

  expect(screen.queryByTestId("section-header-subtitle-spinner")).toBeNull();
});

it("displays available actions", async () => {
  const subnet = factory.subnetDetails({ id: 1, name: "subnet-1" });
  renderWithProviders(<SubnetDetailsHeader subnet={subnet} />);

  ["Map subnet", "Edit boot architectures", "Delete subnet"].forEach((name) => {
    expect(screen.queryByRole("menuitem", { name })).not.toBeInTheDocument();
  });

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: "Take action" })
    ).not.toBeAriaDisabled();
  });
  await userEvent.click(screen.getByRole("button", { name: "Take action" }));

  ["Map subnet", "Edit boot architectures", "Delete subnet"].forEach((name) => {
    expect(screen.getByRole("menuitem", { name })).toBeInTheDocument();
  });
});

it("disables the Take action dropdown without the edit entitlement", async () => {
  mockServer.use(authResolvers.getMeEntitlements.handler([]));
  const subnet = factory.subnetDetails({ id: 1, name: "subnet-1" });
  renderWithProviders(<SubnetDetailsHeader subnet={subnet} />);

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: "Take action" })
    ).toBeAriaDisabled();
  });
});
