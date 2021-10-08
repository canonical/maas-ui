import type { ReactNode } from "react";
import { useEffect } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useLocation } from "react-router-dom";

import type { SectionHeaderProps } from "app/base/components/SectionHeader";
import SectionHeader from "app/base/components/SectionHeader";
import type { SetSearchFilter } from "app/base/types";
import KVMHeaderForms from "app/kvm/components/KVMHeaderForms";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";

type TitleBlock = {
  title: ReactNode;
  subtitle?: ReactNode;
};

type Props = {
  buttons?: SectionHeaderProps["buttons"];
  headerContent: KVMHeaderContent | null;
  setHeaderContent: KVMSetHeaderContent;
  setSearchFilter?: SetSearchFilter;
  tabLinks: SectionHeaderProps["tabLinks"];
  title: ReactNode;
  titleBlocks: TitleBlock[];
};

const KVMDetailsHeader = ({
  buttons,
  headerContent,
  setHeaderContent,
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
      setHeaderContent(null);
    }
  }, [pathname, previousPathname, setHeaderContent]);

  return (
    <SectionHeader
      buttons={buttons}
      headerContent={
        headerContent ? (
          <KVMHeaderForms
            headerContent={headerContent}
            setHeaderContent={setHeaderContent}
            setSearchFilter={setSearchFilter}
          />
        ) : null
      }
      tabLinks={tabLinks}
      title={
        <div className="kvm-details-header__title-blocks p-divider u-no-margin--bottom">
          <div className="kvm-details-header__title-block p-divider__block">
            <h1 className="p-heading--4 u-no-margin--bottom">{title}</h1>
          </div>
          {!headerContent &&
            titleBlocks.map((block, i) => (
              <div
                className="kvm-details-header__title-block p-divider__block"
                data-test="extra-title-block"
                key={`title-block-${i}`}
              >
                <p
                  className="u-text--muted u-no-margin u-no-padding"
                  data-test="block-title"
                >
                  {block.title}
                </p>
                <p
                  className="u-no-margin u-no-padding"
                  data-test="block-subtitle"
                >
                  {block.subtitle || " "}
                </p>
              </div>
            ))}
        </div>
      }
    />
  );
};

export default KVMDetailsHeader;
