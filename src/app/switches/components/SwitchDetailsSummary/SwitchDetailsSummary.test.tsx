import SwitchDetailsSummary from "./SwitchDetailsSummary";

import { switchResolvers } from "@/testing/resolvers/switches";
import { renderWithProviders, screen, setupMockServer } from "@/testing/utils";

setupMockServer(switchResolvers.getSwitch.handler());

describe("SwitchDetailsSummary", () => {
  it("renders the image and mac address cards", () => {
    renderWithProviders(<SwitchDetailsSummary id={1} />);

    expect(screen.getByText("Image")).toBeInTheDocument();
    expect(screen.getByText("Mac Address")).toBeInTheDocument();
  });
});
