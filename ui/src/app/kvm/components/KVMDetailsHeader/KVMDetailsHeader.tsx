import type { ReactNode } from "react";
import { useEffect } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import classNames from "classnames";
import { useLocation } from "react-router-dom";

import type { SectionHeaderProps } from "app/base/components/SectionHeader";
import SectionHeader from "app/base/components/SectionHeader";
import type { SetSearchFilter } from "app/base/types";
import KVMHeaderForms from "app/kvm/components/KVMHeaderForms";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import { getFormTitle } from "app/kvm/utils";

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
  titleBlocks: TitleBlock[];
};

const KVMDetailsHeader = ({
  buttons,
  headerContent,
  setHeaderContent,
  setSearchFilter,
  tabLinks,
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
        headerContent ? (
          <span className="p-heading--4" data-test="form-title">
            {getFormTitle(headerContent)}
          </span>
        ) : (
          <div
            className="kvm-details-header__title-blocks"
            data-test="title-blocks"
          >
            {titleBlocks.map((block, i) => (
              <div
                className="kvm-details-header__title-block"
                key={`title-block-${i}`}
              >
                <h4
                  className={classNames("u-no-margin--bottom", {
                    "u-text--muted": i !== 0,
                  })}
                  data-test="block-title"
                >
                  {block.title}
                </h4>
                <span className="u-text--muted" data-test="block-subtitle">
                  {block.subtitle || " "}
                </span>
              </div>
            ))}
          </div>
        )
      }
    />
  );
};

export default KVMDetailsHeader;
