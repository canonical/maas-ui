import { render, screen } from "@testing-library/react";

import SubnetUtilisation from "./SubnetUtilisation";

import { subnetStatistics as subnetStatisticsFactory } from "testing/factories";

it("renders subnet utilisation statistics", () => {
  const subnetStatistics = subnetStatisticsFactory({
    available_string: "100%",
    num_available: 111,
    total_addresses: 111,
    usage_string: "50%",
  });

  render(<SubnetUtilisation statistics={subnetStatistics} />);

  expect(screen.getByLabelText("Subnet addresses")).toHaveTextContent(
    subnetStatistics.total_addresses.toString()
  );
  expect(screen.getByLabelText("Availability")).toHaveTextContent(
    `${subnetStatistics.num_available} (${subnetStatistics.available_string})`
  );
  expect(screen.getByLabelText("Used")).toHaveTextContent(
    subnetStatistics.usage_string.toString()
  );
});
