import type { ReactNode } from "react";
import { useEffect } from "react";

import type { ClassName } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import classNames from "classnames";
import { useLocation } from "react-router-dom";

import type { SectionHeaderProps } from "app/base/components/SectionHeader";
import SectionHeader from "app/base/components/SectionHeader";
import type { SetSearchFilter } from "app/base/types";
import KVMForms from "app/kvm/components/KVMHeaderForms";
import type {
  KVMSetSidePanelContent,
  KVMSidePanelContent,
} from "app/kvm/types";
import { getFormTitle } from "app/kvm/utils";

type TitleBlock = {
  title: ReactNode;
  subtitle?: ReactNode;
};

type Props = {
  buttons?: SectionHeaderProps["buttons"];
  className?: ClassName;
  sidePanelContent: KVMSidePanelContent | null;
  loading?: SectionHeaderProps["loading"];
  setSidePanelContent: KVMSetSidePanelContent;
  searchFilter?: string;
  setSearchFilter?: SetSearchFilter;
  tabLinks: SectionHeaderProps["tabLinks"];
  title: ReactNode;
  titleBlocks: TitleBlock[];
};

const KVMDetailsHeader = ({
  buttons,
  className,
  sidePanelContent,
  loading,
  setSidePanelContent,
  searchFilter,
  setSearchFilter,
  tabLinks,
  title,
  titleBlocks,
}: Props): JSX.Element => {
  const location = useLocation();
  const pathname = location.pathname;
  const previousPathname = usePrevious(pathname);

  // Close the action form if the pathname changes.
  useEffect(() => {
    if (previousPathname && pathname !== previousPathname) {
      setSidePanelContent(null);
    }
  }, [pathname, previousPathname, setSidePanelContent]);

  return (
    <SectionHeader
      buttons={buttons}
      className={classNames("kvm-details-header", className)}
      headerSize="wide"
      loading={loading}
      sidePanelContent={
        sidePanelContent ? (
          <KVMForms
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        ) : null
      }
      sidePanelTitle={sidePanelContent ? getFormTitle(sidePanelContent) : ""}
      subtitle={
        <>
          {titleBlocks.map((block, i) => (
            <div
              className="kvm-details-header__title-block"
              data-testid="extra-title-block"
              key={`title-block-${i}`}
            >
              <p
                className="u-text--muted u-no-margin u-no-padding"
                data-testid="block-title"
              >
                {block.title}
              </p>
              <p
                className="u-no-margin u-no-padding"
                data-testid="block-subtitle"
              >
                {block.subtitle || " "}
              </p>
            </div>
          ))}
        </>
      }
      subtitleClassName="kvm-details-header__title-blocks u-flex"
      tabLinks={tabLinks}
      title={title}
    />
  );
};

export default KVMDetailsHeader;
