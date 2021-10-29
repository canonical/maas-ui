import type { ReactNode } from "react";
import { useEffect } from "react";

import type { ClassName } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import classNames from "classnames";
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
  className?: ClassName;
  headerContent: KVMHeaderContent | null;
  loading?: SectionHeaderProps["loading"];
  setHeaderContent: KVMSetHeaderContent;
  setSearchFilter?: SetSearchFilter;
  tabLinks: SectionHeaderProps["tabLinks"];
  title: ReactNode;
  titleBlocks: TitleBlock[];
};

const KVMDetailsHeader = ({
  buttons,
  className,
  headerContent,
  loading,
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
      className={classNames("kvm-details-header", className)}
      headerContent={
        headerContent ? (
          <KVMHeaderForms
            headerContent={headerContent}
            setHeaderContent={setHeaderContent}
            setSearchFilter={setSearchFilter}
          />
        ) : null
      }
      loading={loading}
      subtitle={
        <>
          {titleBlocks.map((block, i) => (
            <div
              className="kvm-details-header__title-block"
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
        </>
      }
      subtitleClassName="kvm-details-header__title-blocks u-flex"
      tabLinks={tabLinks}
      title={title}
    />
  );
};

export default KVMDetailsHeader;
