import { Input } from "@canonical/react-components";

import NetworksHeader from "./NetworksHeader";

import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from "@/testing/utils";

describe("NetworksHeader", () => {
  describe("navigation", () => {
    ["Subnets", "VLANS", "Spaces", "Fabrics"].forEach((view) => {
      it(`navigates to the ${view} list when the ${view} tab is clicked`, async () => {
        renderWithProviders(<NetworksHeader />);

        await userEvent.click(
          screen.getByRole("link", { name: new RegExp(view) })
        );

        await waitFor(() => {
          expect(window.location.pathname).toBe(
            `/networks/${view.toLowerCase()}`
          );
        });
      });
    });
  });

  describe("display", () => {
    it("renders controls passed in as a prop", () => {
      renderWithProviders(
        <NetworksHeader controls={<Input aria-label="search" type="text" />} />
      );

      expect(
        screen.getByRole("textbox", { name: "searc" })
      ).toBeInTheDocument();
    });
  });
});
