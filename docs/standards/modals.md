# Modals

## TL;DR

- Use `useModal()` (from `@/app/base/modal-context`) to open and close modals — never manage modal visibility with local state or URL query params.
- Pass the component class to `openModal`, not a JSX element.
- Use a modal (not a side panel) for forms with **no fields** (simple confirmations) and forms whose action is **destructive** (e.g. delete).
- `title` is rendered by the `<Modal />` header.
- `props` are typed via the `TProps` generic on `openModal`.
- The modal closes on Escape and on outside click — it does **not** auto-close on route change, so call `closeModal` explicitly on cancel and after success.
- There are no size variants — a modal is always a single fixed-width dialog.
- One modal per app — only one can be open at a time.
- Test with `mockModal` from `@/testing/utils`. Always call it with `await` at the module level.
- `mockModal` returns `{ mockOpen, mockClose }` for asserting open and close behaviour.

---

## Modals vs Side Panels

Both use the same open/close-by-context pattern, but they exist for different kinds of content. Use this to decide which one a new form needs — see [Forms](forms.md#choosing-a-side-panel-or-a-modal) for the same guidance from the form-authoring side.

| Use a **modal** when...                                   | Use a **side panel** when...                        |
| ----------------------------------------------------------- | ------------------------------------------------------ |
| The form has no fields — it's a plain confirmation           | The form collects input (add/edit forms)                |
| The action is destructive (delete, remove, release, etc.)   | The action is not destructive                            |
| A short, focused interruption is appropriate                | The user may want to reference the page while filling it in |

Concretely: `ModelActionForm` and other confirmation-only/destructive forms open in a modal via `openModal`. Everything else — forms with fields that aren't destructive — opens in a side panel via `openSidePanel`. See [`FieldlessForm`](/src/app/base/components/node/FieldlessForm/FieldlessForm.tsx) for a component that is opened as either, depending on which context it's rendered from, and [`DeleteController`](/src/app/controllers/components/ControllerForms/DeleteController/DeleteController.tsx) for a destructive form that always opens as a modal.

---

## Architecture

`ModalContextProvider` wraps the app. `<Modal />` (from `@canonical/react-components`) is rendered by `<AppLayout />`, not `<PageContent />` — it renders the `component` held in context.

```
ModalContextProvider
└── AppLayout
    ├── Modal            ← renders context.component with context.props, when context.isOpen
    └── <page content>
```

`<AppLayout />` always renders the modal conditionally on `isOpen` — feature code never mounts `<Modal />` directly. Because a single context backs it, only one modal can be open at a time. Opening a second modal replaces the first.

Unlike the side panel, the modal context does not listen for route changes, so navigating away from the page that opened a modal will **not** close it automatically. Always call `closeModal` explicitly.

---

## Opening a Modal

```tsx
import { useModal } from "@/app/base/modal-context";
import { DeleteController } from "@/app/controllers/components/ControllerForms/DeleteController";

const { openModal } = useModal();

openModal({
  component: DeleteController,
  title: "Delete controller",
});
```

With props:

```tsx
openModal({
  component: DeleteController,
  title: "Delete controller",
  props: { controllers: selectedControllers, isViewingDetails: false },
});
```

- `component` — the component class, not `<DeleteController />`.
- `title` — rendered by the `<Modal />` header.
- `props` — typed through the `TProps` generic; defaults to `{}`.

Real-world example from `ControllerListHeader`, choosing between a modal and a side panel depending on whether the action needs confirmation:

```tsx
const openForm = ControllerActionConfirmations.some(
  (nodeAction) => nodeAction === action
)
  ? openModal
  : openSidePanel;

openForm({
  component: ControllerActionFormWrapper,
  props: { action, controllers: selectedControllers, viewingDetails: false },
  title,
});
```

---

## Closing a Modal

```tsx
const { closeModal } = useModal();

<Button onClick={closeModal}>Cancel</Button>;
```

Call `closeModal` explicitly:

- In a cancel button handler.
- In an `onSuccess` callback after a successful mutation.

The modal also closes automatically when:

- The user presses Escape.
- The user clicks outside the modal.

It does **not** close automatically on route navigation — if the form can trigger a redirect (e.g. `savedRedirect` on `ActionForm`), make sure `closeModal` is also called so the modal doesn't linger open on the new page.

---

## Lazy Loading

`lazyLoadModal(loader)` mirrors `lazyLoadSidePanel` for side panels: it wraps a `() => import(...)` in its own `Suspense` boundary so `<Modal />` stays mounted (and open) while the chunk loads, showing a skeleton inside the modal instead of remounting it.

```tsx
const DeleteUser = lazyLoadModal(() => import("./DeleteUser"));

openModal({ component: DeleteUser, title: "Delete user" });
```

Define the lazy-loaded component at module scope in the file that opens it, the same as with `lazyLoadSidePanel`.

---

## Testing Modals

`mockModal` is exported from `@/testing/utils`. It must be called with `await` at the top level of the module (outside `describe`).

### Asserting a modal opens

```tsx
import ControllerListHeader from "./ControllerListHeader";

import { mockModal, renderWithProviders, screen, userEvent } from "@/testing/utils";

const { mockOpen } = await mockModal();

describe("ControllerListHeader", () => {
  it("opens a modal for actions that require confirmation", async () => {
    renderWithProviders(<ControllerListHeader ... />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mockOpen).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Delete" })
    );
  });
});
```

### Asserting a modal closes

```tsx
import DeleteController from "./DeleteController";
import { mockModal, renderWithProviders, screen, userEvent } from "@/testing/utils";

const { mockClose } = await mockModal();

describe("DeleteController", () => {
  it("calls closeModal on cancel click", async () => {
    renderWithProviders(<DeleteController controllers={[...]} isViewingDetails={false} />);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockClose).toHaveBeenCalled();
  });
});
```

If a component can be opened as either a side panel or a modal (like `FieldlessForm`), mock both and assert only the relevant one was called:

```tsx
const { mockClose: mockCloseSidePanel } = await mockSidePanel();
const { mockClose: mockCloseModal } = await mockModal();

// ...
expect(mockCloseModal).toHaveBeenCalled();
expect(mockCloseSidePanel).not.toHaveBeenCalled();
```

---

## Dos and Don'ts

**Do** pass the component class to `openModal`.

```tsx
openModal({ component: DeleteController, title: "Delete controller" });
```

**Don't** pass a JSX element.

```tsx
openModal({ component: <DeleteController />, title: "Delete controller" });
```

---

**Do** use a modal for fieldless (confirmation-only) and destructive forms.

**Don't** put a destructive action or a fieldless confirmation in a side panel.

---

**Do** call `closeModal` on cancel and after a successful mutation.

```tsx
const { closeModal } = useModal();
<Button onClick={closeModal}>Cancel</Button>;
```

**Don't** assume the modal closes on navigation — it doesn't. Call `closeModal` explicitly if the action redirects.

---

**Do** use `mockModal` to verify open/close behaviour in tests.

```tsx
const { mockOpen, mockClose } = await mockModal();
```

**Don't** mock `useModal` manually in individual tests.

---

**Do** call `await mockModal()` at module level, outside any `describe` or `it` block.

```tsx
const { mockOpen } = await mockModal();

describe("MyComponent", () => { ... });
```

**Don't** call `mockModal()` inside a `beforeEach` or a test body — it registers its own `beforeEach` internally and must run at the top level.

---

**Do** compose all modal content inside a single component passed to `openModal`.

**Don't** render `<Modal />` directly in feature components — it's only ever rendered by `<AppLayout />`.
