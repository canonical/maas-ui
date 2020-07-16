import type { RootState } from "app/store/root/types";
import type { SSHKey } from "app/store/sshkey/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns a list of all SSH keys.
 * @param {RootState} state - The redux state.
 * @returns {SSHKey[]} A list of all state.sshkey.items.
 */
const all = (state: RootState): SSHKey[] => state.sshkey.items;

/**
 * Whether the SSH keys are loading.
 * @param {RootState} state - The redux state.
 * @returns {SSHKeyState["loading"]} Whether SSH keys are loading.
 */
const loading = (state: RootState): boolean => state.sshkey.loading;

/**
 * Whether the SSH keys have been loaded.
 * @param {RootState} state - The redux state.
 * @returns {SSHKeyState["loaded"]} Whether SSH keys have loaded.
 */
const loaded = (state: RootState): boolean => state.sshkey.loaded;

/**
 * Get the SSH key errors.
 * @param {RootState} state - The redux state.
 * @returns {SSHKeyState["errors"]} The errors from the API.
 */
const errors = (state: RootState): TSFixMe => state.sshkey.errors;

/**
 * Whether the SSH keys are saving.
 * @param {RootState} state - The redux state.
 * @returns {SSHKeyState["saving"]} Whether SSH keys are saving.
 */
const saving = (state: RootState): boolean => state.sshkey.saving;

/**
 * Whether the SSH keys have been saved.
 * @param {RootState} state - The redux state.
 * @returns {SSHKeyState["saved"]} Whether SSH keys have saved.
 */
const saved = (state: RootState): boolean => state.sshkey.saved;

const sshkey = {
  all,
  errors,
  loaded,
  loading,
  saved,
  saving,
};

export default sshkey;
