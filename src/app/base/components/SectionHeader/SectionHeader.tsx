import type { ReactNode } from "react";

import { MainToolbar } from "@canonical/maas-react-components";
import type { ClassName } from "@canonical/react-components";
import { List, Spinner, Tabs } from "@canonical/react-components";
import type { TabLink } from "@canonical/react-components/dist/components/Tabs/Tabs";
import classNames from "classnames";
import type { JSX } from "react/jsx-runtime";
import type { LinkProps } from "react-router";

import type { DataTestElement } from "@/app/base/types";

export type Props<P = LinkProps> = {
  readonly actionMenuGroup?: React.ReactElement | null;
  readonly buttons?: React.ReactElement[] | null;
  readonly className?: ClassName;
  readonly renderButtons?: () => ReactNode;
  readonly headerSize?: "wide";
  readonly loading?: boolean;
  readonly subtitle?: ReactNode;
  readonly subtitleClassName?: string;
  readonly subtitleLoading?: boolean;
  readonly tabLinks?: DataTestElement<TabLink<P>>[];
  readonly title?: ReactNode;
  readonly titleClassName?: string;
  readonly titleElement?: keyof JSX.IntrinsicElements;
};

const generateSubtitle = (
  subtitle: Props["subtitle"],
  subtitleClassName: Props["subtitleClassName"],
  subtitleLoading: Props["subtitleLoading"],
  titleLoading: Props["loading"]
) => {
  if (titleLoading || !(subtitle || subtitleLoading)) {
    return null;
  }
  let content = subtitle;
  if (subtitleLoading) {
    content = (
      <Spinner
        className="u-text--muted"
        data-testid="section-header-subtitle-spinner"
        text="Loading..."
      />
    );
  } else if (typeof subtitle === "string") {
    content = <span className="u-text--muted">{subtitle}</span>;
  }
  return (
    <div
      className={classNames(
        "section-header__subtitle u-flex--grow",
        subtitleClassName
      )}
      data-testid="section-header-subtitle"
    >
      {content}
    </div>
  );
};

const SectionHeader = <P,>({
  actionMenuGroup,
  buttons = [],
  renderButtons,
  className,
  headerSize,
  loading,
  subtitle,
  subtitleClassName,
  subtitleLoading,
  tabLinks,
  title,
  titleClassName,
  titleElement = "h1",
  ...props
}: Props<P>): React.ReactElement | null => {
  return (
    <div className={classNames("section-header", className)} {...props}>
      <MainToolbar>
        {loading ? (
          <MainToolbar.Title
            aria-label="loading"
            as="h4"
            className={titleClassName}
            data-testid="section-header-title-spinner"
          >
            <Spinner aria-hidden="true" text="Loading..." />
          </MainToolbar.Title>
        ) : title ? (
          <MainToolbar.Title
            as={titleElement}
            className={titleClassName}
            data-testid="section-header-title"
          >
            {title}
          </MainToolbar.Title>
        ) : null}
        {generateSubtitle(
          subtitle,
          subtitleClassName,
          subtitleLoading,
          loading
        )}
        <MainToolbar.Controls>
          {buttons?.length ? (
            <List
              className="section-header__buttons u-flex--between"
              data-testid="section-header-buttons"
              inline
              items={buttons.map((button, i) => ({
                content: button,
                key: `section-header-button-${i}`,
              }))}
            />
          ) : null}
          {renderButtons && typeof renderButtons === "function"
            ? renderButtons()
            : null}
        </MainToolbar.Controls>
      </MainToolbar>
      {actionMenuGroup ? <>{actionMenuGroup}</> : null}
      {tabLinks?.length ? (
        <div className="section-header__tabs" data-testid="section-header-tabs">
          <Tabs links={tabLinks} listClassName="u-no-margin--bottom" />
        </div>
      ) : null}
    </div>
  );
};

export default SectionHeader;
