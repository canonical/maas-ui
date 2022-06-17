import type { ReactNode } from "react";

import type { ClassName, TabsProps } from "@canonical/react-components";
import { List, Spinner, Tabs } from "@canonical/react-components";
import classNames from "classnames";
import type { LinkProps } from "react-router-dom";

import type { DataTestElement } from "app/base/types";

export type Props<P = LinkProps> = {
  buttons?: JSX.Element[] | null;
  className?: ClassName;
  headerContent?: ReactNode | null;
  loading?: boolean;
  subtitle?: ReactNode;
  subtitleClassName?: string;
  subtitleLoading?: boolean;
  tabLinks?: DataTestElement<TabsProps<P>["links"]>;
  title?: ReactNode;
  titleClassName?: string;
  titleElement?: keyof JSX.IntrinsicElements;
};

const generateSubtitle = (
  subtitle: Props["subtitle"],
  subtitleClassName: Props["subtitleClassName"],
  subtitleLoading: Props["subtitleLoading"],
  titleLoading: Props["loading"],
  headerContent: Props["headerContent"]
) => {
  if (headerContent || titleLoading || !(subtitle || subtitleLoading)) {
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
  buttons = [],
  className,
  headerContent,
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
      <div className="section-header__main-row u-flex--between u-flex--wrap">
        <div className="section-header__titles u-flex--align-baseline u-flex--grow u-flex--wrap">
          {loading || !title ? (
            <h4
              aria-label="loading"
              className="section-header__title"
              data-testid="section-header-title-spinner"
            >
              <Spinner aria-hidden="true" text="Loading..." />
            </h4>
          ) : (
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
          )}
          {generateSubtitle(
            subtitle,
            subtitleClassName,
            subtitleLoading,
            loading,
            headerContent
          )}
        </div>
        {buttons?.length && !headerContent ? (
          <List
            className="section-header__buttons"
            data-testid="section-header-buttons"
            inline
            items={buttons.map((button, i) => ({
              content: button,
              key: `section-header-button-${i}`,
            }))}
          />
        ) : null}
      </div>
      {headerContent ? (
        <div
          className="section-header__content"
          data-testid="section-header-content"
        >
          <hr />
          {headerContent}
        </div>
      ) : null}
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
