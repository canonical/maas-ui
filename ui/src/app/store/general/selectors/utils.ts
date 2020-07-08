import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";

export const generateGeneralSelector = (name: string): TSFixMe => {
  const get = (state: RootState): TSFixMe => state.general[name].data;
  const loading = (state: RootState): boolean => state.general[name].loading;
  const loaded = (state: RootState): boolean => state.general[name].loaded;
  const errors = (state: RootState): TSFixMe => state.general[name].errors;

  return {
    errors,
    get,
    loaded,
    loading,
  };
};

export default generateGeneralSelector;
