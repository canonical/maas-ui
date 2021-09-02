import type { UIState } from "./types";

import type { RootState } from "app/store/root/types";

/**
 * Get the currently open header form.
 * @param state - The redux state.
 * @returns The header form data.
 */
const headerForm = (state: RootState): UIState["headerForm"] =>
  state.ui.headerForm;

const selectors = {
  headerForm,
};

export default selectors;
