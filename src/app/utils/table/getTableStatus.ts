export type TableStatus = "loading" | "filtered" | "default";

export const getTableStatus = ({
  isLoading,
  hasFilter,
}: {
  isLoading?: boolean;
  hasFilter?: boolean;
}): TableStatus => {
  if (isLoading) return "loading";
  if (hasFilter) return "filtered";
  return "default";
};
