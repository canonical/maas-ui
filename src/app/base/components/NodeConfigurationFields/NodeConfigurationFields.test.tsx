import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import NodeConfigurationFields, { Label } from "./NodeConfigurationFields";

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
import { mockFormikFormSaved } from "testing/mockFormikFormSaved";
import { render, screen, waitFor } from "testing/utils";

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
        <CompatRouter>
          <Formik initialValues={{ tags: [] }} onSubmit={jest.fn()}>
            <NodeConfigurationFields />
          </Formik>
        </CompatRouter>
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

it("does not display automatic tags on the list", async () => {
  const manualTag = tagFactory({ id: 1, name: "tag1" });
  const automaticTag = tagFactory({
    id: 4,
    name: "automatic-tag",
    definition: `//node[@class="system"]/vendor = "QEMU"`,
  });
  state.tag.items = [manualTag, automaticTag];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <Formik initialValues={{ tags: [] }} onSubmit={jest.fn()}>
            <NodeConfigurationFields />
          </Formik>
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.click(
    screen.getByRole("textbox", { name: TagFieldLabel.Input })
  );
  expect(
    screen.getByRole("option", { name: manualTag.name })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("option", {
      name: automaticTag.name,
    })
  ).not.toBeInTheDocument();
});

it("updates the new tags after creating a tag", async () => {
  const store = mockStore(state);
  const Form = ({ tags }: { tags: Tag[TagMeta.PK][] }) => (
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <Formik initialValues={{ tags: tags }} onSubmit={jest.fn()}>
            <NodeConfigurationFields />
          </Formik>
        </CompatRouter>
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

  mockFormikFormSaved();
  const newTag = tagFactory({ id: 8, name: "new-tag" });
  state.tag.saved = true;
  state.tag.items.push(newTag);
  await userEvent.click(
    screen.getByRole("button", { name: AddTagFormLabel.Submit })
  );
  rerender(<Form tags={[newTag.id]} />);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /new-tag/i })).toBeInTheDocument()
  );
});
