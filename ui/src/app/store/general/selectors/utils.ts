import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";

type GeneralSelector<T> = {
  errors: (state: RootState) => TSFixMe;
  get: (state: RootState) => T;
  loaded: (state: RootState) => boolean;
  loading: (state: RootState) => boolean;
};

export const generateGeneralSelector = <T>(
  name: string
): GeneralSelector<T> => {
  const get = (state: RootState): T => state.general[name].data;
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
