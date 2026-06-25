import { Formik } from "formik";

import GroupMultiSelect, { Labels } from "./GroupMultiSelect";

import { groupsResolvers, mockGroups } from "@/testing/resolvers/groups";
import {
  userEvent,
  screen,
  setupMockServer,
  renderWithProviders,
  waitForLoading,
} from "@/testing/utils";

setupMockServer(
  groupsResolvers.listGroups.handler(),
  groupsResolvers.listGroupsStatistics.handler()
);

const renderField = (onSubmit = vi.fn()) =>
  renderWithProviders(
    <Formik initialValues={{ groups: [] }} onSubmit={onSubmit}>
      <GroupMultiSelect name="groups" />
    </Formik>
  );

describe("GroupMultiSelect", () => {
  it("displays the available groups", async () => {
    renderField();

    await waitForLoading();

    await userEvent.click(
      screen.getByRole("combobox", { name: Labels.DefaultLabel })
    );

    for (const group of mockGroups.items) {
      expect(
        screen.getByRole("checkbox", { name: new RegExp(group.name) })
      ).toBeInTheDocument();
    }
  });

  it("updates the form value when a group is selected", async () => {
    renderField();

    await waitForLoading();

    await userEvent.click(
      screen.getByRole("combobox", { name: Labels.DefaultLabel })
    );

    await userEvent.click(
      screen.getByRole("checkbox", {
        name: new RegExp(mockGroups.items[0].name),
      })
    );

    expect(
      screen.getByRole("combobox", { name: Labels.DefaultLabel })
    ).toHaveTextContent(new RegExp(mockGroups.items[0].name));
  });
});
