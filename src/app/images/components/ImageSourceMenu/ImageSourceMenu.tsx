import type { MenuLink } from "@canonical/react-components";
import { ContextualMenu } from "@canonical/react-components";

type SourceOption = { id: number; name?: string | null };

type ImageSourceMenuProps = {
  sources: SourceOption[];
  currentSourceId: number | undefined;
  onSourceSelect: (source: SourceOption) => void;
  disabled?: boolean;
};

const ImageSourceMenu = ({
  sources,
  currentSourceId,
  onSourceSelect,
  disabled = false,
}: ImageSourceMenuProps) => {
  const currentSource = sources.find((s) => s.id === currentSourceId);

  return (
    <ContextualMenu
      className="p-table-menu"
      hasToggleIcon
      links={[
        "Change source:",
        ...sources.map(
          (source): MenuLink => ({
            disabled: source.id === currentSourceId,
            children: source.name ?? "",
            onClick: () => {
              onSourceSelect(source);
            },
          })
        ),
      ]}
      position="right"
      toggleAppearance="base"
      toggleClassName="u-no-margin--bottom p-table-menu__toggle"
      toggleDisabled={disabled}
      toggleLabel={currentSource?.name ?? undefined}
    />
  );
};

export default ImageSourceMenu;
