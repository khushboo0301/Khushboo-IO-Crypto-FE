import React from "react";
import classnames from "classnames";
import { usePagination, DOTS } from "./usePagination";
import { Pagination } from "react-bootstrap";

// this component is used for paggination applied in every table 
const PaginationComponent = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange?.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage =
    paginationRange && paginationRange[paginationRange?.length - 1];
  return (
    <>
      <Pagination>
        <Pagination.Prev
          className={classnames("pagination-item", {
            disabled: currentPage === 1,
          })}
          onClick={onPrevious}
        >
          PREV
        </Pagination.Prev>

        {paginationRange?.map((pageNumber,index) => {
          if (pageNumber === DOTS) {
            return <Pagination.Item key={index}>...</Pagination.Item>;
          }

          return (
            <Pagination.Item
              key={index}
              active={pageNumber === currentPage}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Pagination.Item>
          );
        })}
        <Pagination.Next
          className={classnames("pagination-item", {
            disabled: currentPage === lastPage,
          })}
          onClick={onNext}
        >
          NEXT
        </Pagination.Next>
      </Pagination>
    </>
  );
};

export default PaginationComponent;
