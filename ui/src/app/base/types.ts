export type TSFixMe = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export type Sort = {
  direction: "ascending" | "descending" | "none";
  key: string;
};

export type RouteParams = {
  id: string;
};

export type AnalyticsEvent = {
  action: string;
  category: string;
  label: string;
};
