export const ImageNonActionHeaderViews = {
  DELETE_IMAGE: ["imageNonActionForm", "deleteImage"],
  DELETE_MULTIPLE_IMAGES: ["imageNonActionForm", "deleteMultipleImages"],
  DOWNLOAD_IMAGE: ["imageNonActionForm", "downloadImage"],
} as const;

export const ImageSidePanelViews = {
  ...ImageNonActionHeaderViews,
} as const;
