import type {
  ElementType,
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import { useMemo, useRef } from "react";

import { Tabs as PragmaTabs } from "@canonical/react-ds-global";
import { Link } from "react-router";

type TabAnchorProps = {
  children?: ReactNode;
  className?: string;
  href?: string;
  "aria-current"?: HTMLAttributes<HTMLElement>["aria-current"];
};

export type TabLink = {
  /** Caller-selected tab. Passed through as `currentUrl`, including on nested routes. */
  active?: boolean;
  /** Accepted so existing call sites type-check. A string `to` renders a router link. */
  component?: ElementType;
  disabled?: boolean;
  href?: string;
  label: ReactNode;
  listItemClassName?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  to?: string;
};

type Props = {
  /** Accessible name for the navigation landmark. */
  "aria-label"?: string;
  className?: string;
  links: TabLink[];
  listClassName?: string;
};

type ClickHandler = (event: MouseEvent<HTMLAnchorElement>) => void;

const stringDestination = (link: TabLink): string | undefined => {
  if (typeof link.to === "string" && link.to.length > 0) {
    return link.to;
  }
  if (!link.onClick && typeof link.href === "string" && link.href.length > 0) {
    return link.href;
  }
  return undefined;
};

const Tabs = ({
  "aria-label": ariaLabel = "Tabs",
  className,
  links,
  listClassName,
}: Props): ReactElement => {
  const routerUrlsRef = useRef(new Set<string>());
  const clickHandlersRef = useRef(new Map<string, ClickHandler>());

  // One link renderer for the strip. Pragma forwards `href`, not `to` or `onClick`.
  const LinkComponent = useMemo(() => {
    const TabLink = ({
      href,
      children,
      ...anchorProps
    }: TabAnchorProps): ReactElement => {
      const onClick = clickHandlersRef.current.get(href ?? "");
      if (onClick) {
        return (
          <a
            {...anchorProps}
            href={href}
            onClick={(event) => {
              event.preventDefault();
              onClick(event);
            }}
          >
            {children}
          </a>
        );
      }
      if (href !== undefined && routerUrlsRef.current.has(href)) {
        return (
          <Link to={href} {...anchorProps}>
            {children}
          </Link>
        );
      }
      return (
        <a {...anchorProps} href={href}>
          {children}
        </a>
      );
    };
    return TabLink;
  }, []);

  const routerUrls = new Set<string>();
  const clickHandlers = new Map<string, ClickHandler>();
  const items = links.map((link, index) => {
    const destination = stringDestination(link);
    const url = destination ?? `#maas-tab-${index}`;
    if (destination && typeof link.to === "string") {
      routerUrls.add(url);
    } else if (link.onClick) {
      clickHandlers.set(url, link.onClick);
    }
    return {
      className: link.listItemClassName,
      disabled: link.disabled,
      // Pragma types `label` as a string. Call sites pass icons and status marks.
      label: link.label as string,
      url,
    };
  });

  routerUrlsRef.current = routerUrls;
  clickHandlersRef.current = clickHandlers;

  const activeIndex = links.findIndex((link) => link.active);
  const currentUrl = activeIndex >= 0 ? items[activeIndex]?.url : undefined;

  return (
    <PragmaTabs
      LinkComponent={LinkComponent}
      aria-label={ariaLabel}
      className={className}
      currentUrl={currentUrl}
      listClassName={listClassName}
      navigationRoot={{
        items,
        key: "tabs",
      }}
    />
  );
};

export default Tabs;
