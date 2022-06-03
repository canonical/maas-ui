import { render, screen } from "@testing-library/react";

import ServiceStatus from "./ServiceStatus";

import {
  ServiceName,
  ServiceStatus as ServiceStatusName,
} from "app/store/service/types";
import { service as serviceFactory } from "testing/factories";

it("correctly renders a running service", () => {
  const service = serviceFactory({ status: ServiceStatusName.RUNNING });
  render(<ServiceStatus service={service} />);

  expect(screen.getByTestId("service-status-icon")).toHaveClass(
    "p-icon--success"
  );
  expect(screen.getByTestId("service-status-icon")).toHaveAccessibleName(
    ServiceStatusName.RUNNING
  );
});

it("correctly renders a degraded service", () => {
  const service = serviceFactory({ status: ServiceStatusName.DEGRADED });
  render(<ServiceStatus service={service} />);

  expect(screen.getByTestId("service-status-icon")).toHaveClass(
    "p-icon--warning"
  );
  expect(screen.getByTestId("service-status-icon")).toHaveAccessibleName(
    ServiceStatusName.DEGRADED
  );
});

it("correctly renders a dead service", () => {
  const service = serviceFactory({ status: ServiceStatusName.DEAD });
  render(<ServiceStatus service={service} />);

  expect(screen.getByTestId("service-status-icon")).toHaveClass(
    "p-icon--error"
  );
  expect(screen.getByTestId("service-status-icon")).toHaveAccessibleName(
    ServiceStatusName.DEAD
  );
});

it("correctly renders an unknown service", () => {
  const service = serviceFactory({ status: ServiceStatusName.UNKNOWN });
  render(<ServiceStatus service={service} />);

  expect(screen.queryByTestId("service-status-icon")).not.toBeInTheDocument();
});

it("renders additional status info if provided", () => {
  const service = serviceFactory({
    name: ServiceName.BIND9,
    status: ServiceStatusName.UNKNOWN,
    status_info: "I have no idea what this is",
  });
  render(<ServiceStatus service={service} />);

  expect(screen.getByText(/I have no idea what this is/i)).toBeInTheDocument();
});
