import OneTouchProvisioning from "./OneTouchProvisioning";

import {
  mockSidePanel,
  renderWithProviders,
  screen,
  userEvent,
} from "@/testing/utils";

const { mockClose } = await mockSidePanel();

describe("OneTouchProvisioning", () => {
  it("runs closeForm function when the cancel button is clicked", async () => {
    renderWithProviders(<OneTouchProvisioning />);

    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockClose).toHaveBeenCalled();
  });

  //will do when endpoint is ready
  it.todo("calls  on save click");
  //will do when endpoint is ready
  it.todo("displays error message when create rack fails");
});
