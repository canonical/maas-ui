export const ImageNonActionHeaderViews = {
  CHANGE_SOURCE: ["imageNonActionForm", "changeSource"],
  DELETE_IMAGE: ["imageNonActionForm", "deleteImage"],
} as const;

export const ImageSidePanelViews = {
  ...ImageNonActionHeaderViews,
} as const;
