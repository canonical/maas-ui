import configureStore from "redux-mock-store";

import TagTable, { Label, TestId } from "./TagTable";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { TagSearchFilter } from "@/app/store/tag/selectors";
import type { Tag } from "@/app/store/tag/types";
import * as factory from "@/testing/factories";
import {
  renderWithProviders,
  screen,
  userEvent,
  within,
} from "@/testing/utils";

vi.mock("../constants", () => ({
  __esModule: true,
  // Mock the number of items per page to allow testing pagination.
  TAGS_PER_PAGE: 2,
}));

const mockStore = configureStore();
let state: RootState;
let tags: Tag[];

beforeEach(() => {
  tags = [
    factory.tag({
      id: 1,
      name: "rad",
    }),
    factory.tag({
      id: 2,
      name: "cool",
    }),
  ];
  state = factory.rootState({
    tag: factory.tagState({
      items: tags,
    }),
  });
});

it("displays tags", () => {
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={vi.fn()}
      tags={tags}
    />,
    { state }
  );
  const names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names).toHaveLength(2);
  expect(names.find((td) => td.textContent === "rad")).toBeInTheDocument();
  expect(names.find((td) => td.textContent === "cool")).toBeInTheDocument();
});

it("displays the tags in order", () => {
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={vi.fn()}
      tags={tags}
    />
  );
  const names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names[0].textContent).toBe("cool");
  expect(names[1].textContent).toBe("rad");
});

it("can change the sort order", async () => {
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={vi.fn()}
      tags={tags}
    />,
    { state }
  );
  let names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names[0].textContent).toBe("cool");
  expect(names[1].textContent).toBe("rad");
  await userEvent.click(
    screen.getByRole("button", { name: `${Label.Name} (descending)` })
  );
  names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names[0].textContent).toBe("rad");
  expect(names[1].textContent).toBe("cool");
});

it("displays the tags for the current page", () => {
  tags = [
    ...new Array(50).fill(factory.tag({ name: "aaaaaa" })),
    factory.tag({ name: "zzz1" }),
    factory.tag({ name: "zzz2" }),
  ];

  renderWithProviders(
    <TagTable
      currentPage={2}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={vi.fn()}
      tags={tags}
    />,
    { state }
  );

  const names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names).toHaveLength(2);
  expect(names.find((td) => td.textContent === "zzz1")).toBeInTheDocument();
  expect(names.find((td) => td.textContent === "zzz2")).toBeInTheDocument();
});

it("shows an icon for automatic tags", () => {
  tags = [factory.tag({ definition: "automatic" })];
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={vi.fn()}
      tags={tags}
    />,
    { state }
  );
  const auto = screen.getByRole("gridcell", {
    name: Label.Auto,
  });

  expect(auto.querySelector(".p-icon--success-grey")).toBeInTheDocument();
});

it("does not show an icon for manual tags", () => {
  tags = [factory.tag({ definition: undefined })];
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={vi.fn()}
      tags={tags}
    />,
    { state }
  );
  const auto = screen.getByRole("gridcell", {
    name: Label.Auto,
  });

  expect(auto.querySelector(".p-icon--success-grey")).not.toBeInTheDocument();
});

it("shows an icon for kernel options", () => {
  tags = [factory.tag({ kernel_opts: "i'm a kernel option" })];
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={vi.fn()}
      tags={tags}
    />,
    { state }
  );
  const auto = screen.getByRole("gridcell", {
    name: Label.Options,
  });

  expect(auto.querySelector(".p-icon--success-grey")).toBeInTheDocument();
});

it("does not show an icon for tags without kernel options", () => {
  tags = [factory.tag({ kernel_opts: undefined })];
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={vi.fn()}
      tags={tags}
    />,
    { state }
  );
  const auto = screen.getByRole("gridcell", {
    name: Label.Options,
  });

  expect(auto.querySelector(".p-icon--success-grey")).not.toBeInTheDocument();
});

it("can link to nodes", () => {
  tags = [
    factory.tag({
      machine_count: 1,
      device_count: 2,
      controller_count: 3,
      name: "a-tag",
    }),
  ];
  state.tag.items = tags;
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={vi.fn()}
      tags={tags}
    />,
    { state }
  );
  const cells = screen.queryAllByRole("gridcell", {
    name: Label.AppliedTo,
  });
  const appliedTo = cells[cells.length - 1];
  const machineLink = within(appliedTo).getByRole("link", {
    name: "1 machine",
  });
  const deviceLink = within(appliedTo).getByRole("link", {
    name: "2 devices",
  });
  const controllerLink = within(appliedTo).getByRole("link", {
    name: "3 controllers",
  });
  expect(machineLink).toBeInTheDocument();
  expect(controllerLink).toBeInTheDocument();
  expect(deviceLink).toBeInTheDocument();
  expect(machineLink).toHaveAttribute(
    "href",
    `${urls.machines.index}?tags=%3Da-tag`
  );
  expect(controllerLink).toHaveAttribute(
    "href",
    `${urls.controllers.index}?tags=%3Da-tag`
  );
  expect(deviceLink).toHaveAttribute(
    "href",
    `${urls.devices.index}?tags=%3Da-tag`
  );
});

it("does not display a message if there are tags", () => {
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={vi.fn()}
      tags={tags}
    />,
    { state }
  );
  expect(screen.queryByTestId(TestId.NoTags)).not.toBeInTheDocument();
});

it("displays a message if there are no automatic tags", () => {
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.Auto}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={vi.fn()}
      tags={[]}
    />,
    { state }
  );
  expect(screen.getByTestId(TestId.NoTags).textContent).toBe(
    "There are no automatic tags."
  );
});

it("displays a message if there are no manual tags", () => {
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.Manual}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={vi.fn()}
      tags={[]}
    />,
    { state }
  );
  expect(screen.getByTestId(TestId.NoTags).textContent).toBe(
    "There are no manual tags."
  );
});

it("displays a message if none match the search terms", () => {
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText="nothing"
      setCurrentPage={vi.fn()}
      tags={[]}
    />,
    { state }
  );
  expect(screen.getByTestId(TestId.NoTags).textContent).toBe(
    "No tags match the search criteria."
  );
});

it("displays a message if none match the filter and search terms", () => {
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.Auto}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText="nothing"
      setCurrentPage={vi.fn()}
      tags={[]}
    />,
    { state }
  );
  expect(screen.getByTestId(TestId.NoTags).textContent).toBe(
    "No automatic tags match the search criteria."
  );
});

it("returns to the first page if the search changes", () => {
  const setCurrentPage = vi.fn();
  const { rerender } = renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText="some text"
      setCurrentPage={setCurrentPage}
      tags={[]}
    />,
    { state }
  );
  rerender(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText="some other text"
      setCurrentPage={setCurrentPage}
      tags={[]}
    />,
    { state }
  );
  expect(setCurrentPage).toHaveBeenCalledWith(1);
});

it("returns to the first page if the filter changes", () => {
  const setCurrentPage = vi.fn();
  const { rerender } = renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={setCurrentPage}
      tags={[]}
    />,
    { state }
  );
  rerender(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.Manual}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      searchText=""
      setCurrentPage={setCurrentPage}
      tags={[]}
    />,
    { state }
  );
  expect(setCurrentPage).toHaveBeenCalledWith(1);
});

it("can trigger the tag edit sidepanel", async () => {
  const store = mockStore(state);
  const onUpdate = vi.fn();
  renderWithProviders(
    <TagTable
      currentPage={1}
      filter={TagSearchFilter.All}
      onDelete={vi.fn()}
      onUpdate={onUpdate}
      searchText=""
      setCurrentPage={vi.fn()}
      tags={tags}
    />,
    { store, initialEntries: [urls.tags.index] }
  );
  await userEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
  expect(onUpdate).toHaveBeenCalled();
});
