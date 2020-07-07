import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";

export const generateGeneralSelector = (name: string): TSFixMe => {
  const get = (state: RootState) => state.general[name].data;
  const loading = (state: RootState) => state.general[name].loading;
  const loaded = (state: RootState) => state.general[name].loaded;
  const errors = (state: RootState) => state.general[name].errors;

  return {
    errors,
    get,
    loaded,
    loading,
  };
};

export default generateGeneralSelector;
