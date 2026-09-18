const urls = {
  index: "/switches",
  details: (id: string) => `/switches/${id}`,
  detailsSummary: (id: string) => `/switches/${id}/summary`,
};

export default urls;
