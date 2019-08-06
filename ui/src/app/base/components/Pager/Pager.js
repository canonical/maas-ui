import PropTypes from "prop-types";
import React from "react";

import PagerButton from "app/base/components/PagerButton";
import PagerItem from "app/base/components/PagerItem";

const PagerItemSeparator = () => (
  <li className="p-pagination__item p-pagination__item--truncation">…</li>
);

const Pager = ({
  itemsPerPage,
  totalItems,
  paginate,
  currentPage,
  truncateThreshold = 10
}) => {
  // return early if no pager is required
  if (totalItems <= itemsPerPage) {
    return null;
  }

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const generatePagerItems = (pageNumbers, currentPage) => {
    const lastPage = pageNumbers.length;
    const truncated = lastPage > truncateThreshold;

    let visiblePages;
    if (truncated) {
      let start = currentPage - 2;
      let end = currentPage + 1;
      if (currentPage === 1) {
        start = 1;
        end = currentPage + 3;
      }
      if (currentPage === 2) {
        start = 1;
        end = currentPage + 2;
      }
      if (currentPage === lastPage) {
        start = lastPage - 4;
        end = lastPage - 1;
      }
      if (currentPage === lastPage - 1) {
        start = lastPage - 4;
        end = lastPage - 1;
      }
      visiblePages = pageNumbers.slice(start, end);
    } else {
      visiblePages = pageNumbers;
    }

    const items = [];
    if (truncated) {
      // render first in sequence
      items.push(
        <PagerItem
          key={1}
          number={1}
          isActive={currentPage === 1}
          onClick={() => paginate(1)}
        />
      );
      if (![1, 2, 3].includes(currentPage)) {
        items.push(<PagerItemSeparator key="sep1" />);
      }
    }

    items.push(
      visiblePages.map(number => (
        <PagerItem
          key={number}
          number={number}
          isActive={number === currentPage}
          onClick={() => paginate(number)}
        />
      ))
    );

    if (truncated) {
      // render last in sequence
      if (![lastPage, lastPage - 1, lastPage - 2].includes(currentPage)) {
        items.push(<PagerItemSeparator key="sep2" />);
      }
      items.push(
        <PagerItem
          key={lastPage}
          number={lastPage}
          isActive={currentPage === lastPage}
          onClick={() => paginate(lastPage)}
        />
      );
    }
    return items;
  };

  return (
    <nav>
      <ul className="p-pagination">
        <PagerButton
          key="back"
          direction="back"
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
        />

        {generatePagerItems(pageNumbers, currentPage)}

        <PagerButton
          key="forward"
          direction="forward"
          disabled={currentPage === pageNumbers.length}
          onClick={() => paginate(currentPage + 1)}
        />
      </ul>
    </nav>
  );
};

Pager.propTypes = {
  itemsPerPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired
};

export default Pager;
