import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeviceConfigurationFields, { Label } from "./DeviceConfigurationFields";

import { Label as TagFieldLabel } from "app/base/components/TagField/TagField";
import * as baseHooks from "app/base/hooks/base";
import type { RootState } from "app/store/root/types";
import type { Tag, TagMeta } from "app/store/tag/types";
import { Label as AddTagFormLabel } from "app/tags/components/AddTagForm/AddTagForm";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();
let state: RootState;
let tags: Tag[];

beforeEach(() => {
  tags = [
    tagFactory({ id: 1, name: "tag1" }),
    tagFactory({ id: 2, name: "tag2" }),
    tagFactory({ id: 3, name: "tag3" }),
  ];
  state = rootStateFactory({
    machine: machineStateFactory({
      items: [
        machineFactory({
          tags: [],
        }),
      ],
    }),
    tag: tagStateFactory({
      items: tags,
    }),
  });
  jest
    .spyOn(baseHooks, "useCycled")
    .mockImplementation(() => [false, () => null]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("can open a create tag form", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{ tags: [] }} onSubmit={jest.fn()}>
          <DeviceConfigurationFields />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: TagFieldLabel.Input }),
    "name1{enter}"
  );
  await waitFor(() =>
    expect(
      screen.getByRole("dialog", { name: Label.AddTag })
    ).toBeInTheDocument()
  );
});

it("updates the new tags after creating a tag", async () => {
  const store = mockStore(state);
  const Form = ({ tags }: { tags: Tag[TagMeta.PK][] }) => (
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{ tags: tags }} onSubmit={jest.fn()}>
          <DeviceConfigurationFields />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const { rerender } = render(<Form tags={[]} />);
  expect(
    screen.queryByRole("button", { name: /new-tag/i })
  ).not.toBeInTheDocument();
  await userEvent.type(
    screen.getByRole("textbox", { name: TagFieldLabel.Input }),
    "new-tag{enter}"
  );
  // Simulate the state.tag.saved state going from `save: false` to `saved:
  // true` which happens when the tag is successfully saved. This in turn will
  // mean that the form `onSuccess` prop will get called so that the component
  // knows that the tag was created.
  jest
    .spyOn(baseHooks, "useCycled")
    .mockImplementation(() => [true, () => null]);
  const newTag = tagFactory({ id: 8, name: "new-tag" });
  state.tag.saved = true;
  state.tag.items.push(newTag);
  fireEvent.submit(screen.getByRole("form", { name: AddTagFormLabel.Form }));
  rerender(<Form tags={[newTag.id]} />);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /new-tag/i })).toBeInTheDocument()
  );
});
