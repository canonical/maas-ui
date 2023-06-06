import type { ReactNode } from "react";

import type { ClassName } from "@canonical/react-components";
import { List, Spinner, Tabs } from "@canonical/react-components";
import type { TabLink } from "@canonical/react-components/dist/components/Tabs/Tabs";
import classNames from "classnames";
import type { LinkProps } from "react-router-dom";

import { AppSidePanelLegacy } from "app/base/components/AppSidePanel";
import type { DataTestElement } from "app/base/types";

export type Props<P = LinkProps> = {
  actionMenuGroup?: JSX.Element | null;
  buttons?: JSX.Element[] | null;
  className?: ClassName;
  renderButtons?: () => ReactNode;
  sidePanelContent?: ReactNode | null;
  sidePanelTitle?: string | null;
  headerSize?: "wide";
  loading?: boolean;
  subtitle?: ReactNode;
  subtitleClassName?: string;
  subtitleLoading?: boolean;
  tabLinks?: DataTestElement<TabLink<P>>[];
  title?: ReactNode;
  titleClassName?: string;
  titleElement?: keyof JSX.IntrinsicElements;
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
  sidePanelContent,
  sidePanelTitle,
  headerSize,
  loading,
  subtitle,
  subtitleClassName,
  subtitleLoading,
  tabLinks,
  title,
  titleClassName,
  titleElement: TitleElement = "h1",
  ...props
}: Props<P>): JSX.Element | null => {
  return (
    <div className={classNames("section-header", className)} {...props}>
      <div className="section-header__main-row">
        {loading ? (
          <div className="section-header__titles u-flex--align-center u-flex--grow u-flex--wrap">
            <h4
              aria-label="loading"
              className="section-header__title"
              data-testid="section-header-title-spinner"
            >
              <Spinner aria-hidden="true" text="Loading..." />
            </h4>
          </div>
        ) : title ? (
          <div className="section-header__titles u-flex--align-center u-flex--grow u-flex--wrap">
            <TitleElement
              className={classNames(
                "section-header__title u-flex--no-shrink",
                titleClassName,
                {
                  "p-heading--4": TitleElement === "h1",
                }
              )}
              data-testid="section-header-title"
            >
              {title}
            </TitleElement>
          </div>
        ) : null}
        {generateSubtitle(
          subtitle,
          subtitleClassName,
          subtitleLoading,
          loading
        )}
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
      </div>
      {renderButtons && typeof renderButtons === "function"
        ? renderButtons()
        : null}
      {sidePanelContent ? (
        <AppSidePanelLegacy
          content={sidePanelContent}
          size={headerSize}
          title={sidePanelTitle}
        />
      ) : null}
      {actionMenuGroup ? <>{actionMenuGroup}</> : null}
      {tabLinks?.length ? (
        <div className="section-header__tabs" data-testid="section-header-tabs">
          <hr className="u-no-margin--bottom" />
          <Tabs
            className="no-border"
            links={tabLinks}
            listClassName="u-no-margin--bottom"
          />
        </div>
      ) : null}
    </div>
  );
};

export default SectionHeader;
