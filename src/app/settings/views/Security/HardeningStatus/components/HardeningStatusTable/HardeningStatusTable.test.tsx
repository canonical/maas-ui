import HardeningStatusTable from "./HardeningStatusTable";

import type { HardeningRequirement } from "@/app/settings/views/Security/HardeningStatus/utils";
import { renderWithProviders, screen } from "@/testing/utils";

const requirements: HardeningRequirement[] = [
  {
    id: 1,
    configKey: "api_bind",
    description: "api_bind is not configured",
    command: "maas config-hardening set api_bind <specific-ip-address>",
  },
];

it("displays a loading state", () => {
  renderWithProviders(<HardeningStatusTable isLoading requirements={[]} />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

it("displays a message when all requirements are met", () => {
  renderWithProviders(
    <HardeningStatusTable isLoading={false} requirements={[]} />
  );

  expect(
    screen.getByText("All hardening requirements are met.")
  ).toBeInTheDocument();
});

it("displays a failing requirement with its resolving command", () => {
  renderWithProviders(
    <HardeningStatusTable isLoading={false} requirements={requirements} />
  );

  expect(screen.getByText("api_bind")).toBeInTheDocument();
  expect(screen.getByText("Not met")).toBeInTheDocument();
  expect(screen.getByText("api_bind is not configured")).toBeInTheDocument();
  expect(
    screen.getByText("maas config-hardening set api_bind <specific-ip-address>")
  ).toBeInTheDocument();
});

it("displays a copy button for the resolving command", () => {
  renderWithProviders(
    <HardeningStatusTable isLoading={false} requirements={requirements} />
  );

  expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
});
