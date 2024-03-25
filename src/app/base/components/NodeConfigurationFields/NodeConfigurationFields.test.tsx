import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NodeConfigurationFields, { Label } from "./NodeConfigurationFields";

import { Label as TagFieldLabel } from "@/app/base/components/TagField/TagField";
import * as baseHooks from "@/app/base/hooks/base";
import type { RootState } from "@/app/store/root/types";
import type { Tag, TagMeta } from "@/app/store/tag/types";
import { Label as AddTagFormLabel } from "@/app/tags/components/AddTagForm/AddTagForm";
import * as factory from "@/testing/factories";
import { mockFormikFormSaved } from "@/testing/mockFormikFormSaved";
import { userEvent, render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();
let state: RootState;
let tags: Tag[];

beforeEach(() => {
  tags = [
    factory.tag({ id: 1, name: "tag1" }),
    factory.tag({ id: 2, name: "tag2" }),
    factory.tag({ id: 3, name: "tag3" }),
  ];
  state = factory.rootState({
    machine: factory.machineState({
      items: [
        factory.machine({
          tags: [],
        }),
      ],
    }),
    tag: factory.tagState({
      items: tags,
    }),
  });
  vi.spyOn(baseHooks, "useCycled").mockImplementation(
    () => [false, () => {}] as ReturnType<typeof baseHooks.useCycled>
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("can open a create tag form", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <Formik initialValues={{ tags: [] }} onSubmit={vi.fn()}>
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
  const manualTag = factory.tag({ id: 1, name: "tag1" });
  const automaticTag = factory.tag({
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
          <Formik initialValues={{ tags: [] }} onSubmit={vi.fn()}>
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
          <Formik initialValues={{ tags: tags }} onSubmit={vi.fn()}>
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
  const newTag = factory.tag({ id: 8, name: "new-tag" });
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
