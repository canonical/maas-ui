# Styling

## TL;DR

- Global styles live in `src/scss/index.scss` — that file is the single entry point.
- Component styles go in a `_index.scss` file next to the component, defined as a SCSS mixin.
- Every new mixin requires two lines in `src/scss/index.scss`: one `@import` and one `@include`.
- Use Vanilla Framework (`p-`, `u-`, `l-` classes) before writing any custom CSS.
- Override Vanilla only in `src/scss/_vanilla-overrides.scss`.
- Never import a stylesheet from a `.tsx` file.
- Never use inline `style={{}}` except for values that cannot be expressed in CSS.
- `@canonical/maas-react-components` CSS is imported globally — do not re-import it.
- View-specific styles belong alongside the view's `_index.scss`, not in the global `src/scss/` directory.
- Scope all custom rules inside the mixin — do not write bare selectors at file root.

---

## Technology Overview

- **Vanilla Framework** — Canonical base CSS library. Provides the `p-`, `u-`, and `l-` utility and pattern classes used throughout the UI. Reach for these before writing custom CSS.
- **`@canonical/maas-react-components`** — MAAS-specific component library. Its stylesheet is imported once in `src/scss/index.scss` and available globally.
- **SCSS** — All custom styles are written in SCSS. Encapsulation is enforced by wrapping rules inside named mixins.

---

## File Organisation

`src/scss/index.scss` is the single stylesheet entry point. It:

1. Imports and includes Vanilla Framework.
2. Imports `src/scss/_vanilla-overrides.scss` for any Vanilla overrides.
3. Imports the `@canonical/maas-react-components` CSS.
4. Imports and includes every component mixin, grouped by domain.

The registration pattern for a component mixin is always two lines:

```scss
@import "@/app/base/components/SectionHeader";
@include SectionHeader;
```

All `@import` lines for a domain are grouped together, followed by all `@include` lines for that domain. See the existing `// base`, `// machines`, `// settings` groupings in `src/scss/index.scss` as the model to follow.

---

## Writing Component Styles

### Step-by-step

1. Create `_index.scss` in the same directory as the component file.
2. Define a mixin named after the component:

```scss
@mixin SectionHeader {
  .section-header__title {
    margin: 0 $sph--large $spv--large 0;
    padding-top: 0.051rem;
  }

  .section-header__buttons {
    > [class*="p-button"],
    > * > [class*="p-button"],
    .p-contextual-menu__toggle {
      margin-bottom: $spv--small;
    }
  }
}
```

3. Register the mixin in `src/scss/index.scss` with both `@import` and `@include`.
4. Do not import the stylesheet from the `.tsx` file.

The mixin name must match the component name exactly. This is the name used in `@include` in `src/scss/index.scss`.

### Do

```scss
@mixin NotificationGroup {
  .p-notification-group {
    .p-notification-group__notification {
      background-image: none;
      border-top: 0;
    }
  }
}
```

### Don't

```scss
.p-notification-group {
  .p-notification-group__notification {
    background-image: none;
  }
}
```

Bare selectors at file root are not encapsulated and will not be included by `src/scss/index.scss` because there is no mixin to `@include`.

---

## Using Vanilla Framework

Use Vanilla Framework classes in JSX before reaching for custom CSS. Use `classNames` for conditional classes.

### Do

```tsx
import classNames from "classnames";

<div className={classNames("p-card", { "is-active": isActive })} />
```

### Don't

```tsx
<div style={{ border: "1px solid #ccc", padding: "1rem" }} />
```

Inline styles bypass Vanilla theming, dark mode, and Vanilla override logic. Only use `style={{}}` for values that are genuinely computed at runtime and cannot be expressed as a static CSS rule.

---

## Overriding Vanilla

All Vanilla Framework overrides go in `src/scss/_vanilla-overrides.scss`. Do not override Vanilla patterns inline in component mixins.

### Do

Place the override in `src/scss/_vanilla-overrides.scss`:

```scss
.p-table--expanding__panel {
  padding: 0;
}
```

### Don't

Override Vanilla classes inside a component mixin:

```scss
@mixin MachineList {
  .p-table--expanding__panel {
    padding: 0;
  }
}
```

Component mixins are for styles that are specific to a component's own class names. Cross-cutting Vanilla overrides belong in `_vanilla-overrides.scss` so they are applied consistently everywhere the Vanilla class appears.

---

## Dos and Don'ts

**Do** use Vanilla Framework classes (`p-`, `u-`, `l-`) before writing custom CSS.

**Don't** duplicate Vanilla styles — check the [Vanilla documentation](https://vanillaframework.io/docs) first.

**Do** scope all custom rules inside a named SCSS mixin in `_index.scss`.

**Don't** write bare selectors at the root of a `_index.scss` file.

**Do** register every new mixin in `src/scss/index.scss` with both `@import` and `@include`.

**Don't** leave a mixin defined but not registered — it will never be included in the build.

**Do** place view-specific `_index.scss` files alongside the view component they style.

**Don't** place view-specific styles in the global `src/scss/` directory.

**Do** put Vanilla overrides in `src/scss/_vanilla-overrides.scss`.

**Don't** import stylesheets from `.tsx` files.

**Don't** use inline `style={{}}` for values that can be expressed as CSS.
