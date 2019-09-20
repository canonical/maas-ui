export const generateGeneralSelector = name => {
  const selector = {};

  selector.get = state => state.general[name].data;
  selector.loading = state => state.general[name].loading;
  selector.loaded = state => state.general[name].loaded;
  selector.errors = state => state.general[name].errors;

  return selector;
};

export default generateGeneralSelector;
