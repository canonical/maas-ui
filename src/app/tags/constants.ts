export const TagSidePanelViews = {
  AddTag: ["addTagForm", "addTag"],
  DeleteTag: ["deleteTagForm", "deleteTag"],
  UpdateTag: ["updateTagForm", "updateTag"],
} as const;

export const NewDefinitionMessage =
  "MAAS will automatically tag every machine that matches the new definition in the background. This can take some time.";
