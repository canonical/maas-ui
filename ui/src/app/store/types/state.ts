export type GenericState<I, E> = {
  errors: E;
  items: I[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
