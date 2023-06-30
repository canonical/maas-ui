import type { MouseEventHandler } from "react";

import classNames from "classnames";

export type Props = {
  /**
   * Whether the pagination item is active, i.e. the current page is this page.
   */
  isActive?: boolean;
  /**
   * The page number.
   */
  number: number;
  /**
   * Function to handle clicking the pagination item.
   */
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const PaginationItem = ({
  number,
  onClick,
  isActive = false,
}: Props): JSX.Element => (
  <li className="p-pagination__item">
    <button
      aria-current={isActive ? "page" : undefined}
      className={classNames("p-pagination__link", {
        "is-active": isActive,
      })}
      onClick={onClick}
      type="button"
    >
      {number}
    </button>
  </li>
);

export default PaginationItem;
