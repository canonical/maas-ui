import ZoneDetailsForm from "./ZoneDetailsForm";

import { zoneActions } from "@/app/store/zone";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  waitFor,
  renderWithBrowserRouter,
} from "@/testing/utils";

describe("ZoneDetailsForm", () => {
  const testZone = factory.zone();
  const queryData = { zones: [testZone] };

  it("runs closeForm function when the cancel button is clicked", async () => {
    const closeForm = vi.fn();
    renderWithBrowserRouter(
      <ZoneDetailsForm closeForm={closeForm} id={testZone.id} />,
      { queryData }
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls actions.update on save click", async () => {
    const { store } = renderWithBrowserRouter(
      <ZoneDetailsForm closeForm={vi.fn()} id={testZone.id} />,
      { queryData }
    );

    await userEvent.clear(screen.getByLabelText("Name"));

    await userEvent.clear(screen.getByLabelText("Description"));

    await userEvent.type(
      screen.getByRole("textbox", { name: /name/i }),
      "test name 2"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /description/i }),
      "test description 2"
    );

    await userEvent.click(screen.getByRole("button", { name: /Update AZ/i }));

    const expectedAction = zoneActions.update({
      id: testZone.id,
      description: "test description 2",
      name: "test name 2",
    });

    await waitFor(() =>
      expect(
        store.getActions().find((action) => action.type === expectedAction.type)
      ).toStrictEqual(expectedAction)
    );
  });
});
