export const isId = <I extends string | number>(id?: I | null): id is I => {
  return !!id || id === 0;
};
