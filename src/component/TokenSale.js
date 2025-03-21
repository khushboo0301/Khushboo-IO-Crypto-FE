import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";
import StatisticsChart from "./StatisticsChart";
import ThisMonthSale from "./ThisMonthSale";
import Sheet from "react-modal-sheet";

//this component is used for token sale dropdown
export const TokenSale = (props) => {
  const { getUser } = props;
  // const [showDropdown, setShowDropdown] = useState(false);
  const [totalToken, setTotalToken] = useState(0);
  const [filterValue, setFilterValue] = useState("thisWeekDate");
  const [filterLabel, setFilterLabel] = useState("This Week");
  const [lineToken, setLineToken] = useState({});
  const [transactions, setTransactions] = useState([]);
  const categories = [
    {
      label: "This Week",
      value: "thisWeekDate",
    },
    {
      label: "This Month",
      value: "thisMonthDate",
    },
    {
      label: "This Year",
      value: "thisYearDate",
    },
    {
      label: "Last Week",
      value: "lastWeek",
    },
    {
      label: "Last Month",
      value: "lastMonth",
    },
    {
      label: "Last 3 Month",
      value: "last3Months",
    },
    {
      label: "Last 6 Month",
      value: "last6Months",
    },
    {
      label: "Last Year",
      value: "lastYear",
    },
  ];

  const [selectedOption, setSelectedOption] = useState(categories[0]);
  const [showOptions, setShowOptions] = useState();
  const [openDr, setOpenDr] = useState(false);
  //const [category, setCategory] = useState("This Week");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobileMatch = window.matchMedia("(max-width: 767px)");
      setIsMobile(mobileMatch.matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCheckboxChange = (option) => {
    setSelectedOption(option);
    //setCategory(option.label);
    setFilterValue(option.value);
    setFilterLabel(option.label);
    setOpenDr(false);
  };

  const handleCheckboxChangeOnMobile = (option) => {
    setSelectedOption(option);
  };

  const handlePhoneNumberMobile = (option) => {
    setSelectedOption(option);
    setFilterValue(option.value);
    setFilterLabel(option.label);
    // setCategory(option.label);
    setOpenDr(false);
  };

  const setTotalTokenValue = (value) => {
    setTotalToken(value);
  };

  const setLineGraphData = (value) => {
    setLineToken(value);
  };

  const setTransactionData = (value) => {
    setTransactions(value);
  };
  const handleDropdownClick = () => {
    setShowOptions(categories);
    setOpenDr(true);
  };

  return (
    <Card className="cards-dark statistics" style={{ minHeight: "281px" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title as="h3">Token Sale Graph</Card.Title>
          <div
            className={`statisticBox d-flex items-center token-graph-dropdown justify-between relative token-sales-filter`}
          >
            {!isMobile ? (
              <>
                <div className="form-control" onClick={handleDropdownClick}>
                  {selectedOption.label}
                </div>
                <Dropdown
                  className="custom-dropdown"
                  show={openDr}
                  onToggle={(isOpen) => setOpenDr(isOpen)}
                >
                  <Dropdown.Toggle onClick={handleDropdownClick}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                    </svg>
                  </Dropdown.Toggle>
                  {openDr && (
                    <Dropdown.Menu className="dropdownMenu">
                      <div className="filter-option">
                        {showOptions?.map((data, key) => (
                          <div
                            key={`${data.value}`}
                            className={`yourself-option form-check`}
                            onClick={() => handleCheckboxChange(data)}
                          >
                            <div
                              className={`form-check-input check-input ${
                                JSON.stringify(selectedOption) ===
                                JSON.stringify(data)
                                  ? "selected"
                                  : ""
                              }`}
                            />
                            <label className="form-check-label">
                              {data.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </Dropdown.Menu>
                  )}
                </Dropdown>
              </>
            ) : (
              <>
                <div className="form-control" onClick={handleDropdownClick}>
                  {selectedOption.label}
                </div>
                <button
                  className="text-white font-medium rounded-lg text-sm"
                  type="button"
                  data-drawer-target="drawer-swipe"
                  data-drawer-show="drawer-swipe"
                  data-drawer-placement="bottom"
                  data-drawer-edge="true"
                  data-drawer-edge-offset="bottom-[60px]"
                  aria-controls="drawer-swipe"
                  onClick={handleDropdownClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                  </svg>
                </button>
                <Sheet
                  isOpen={openDr}
                  onClose={() => {
                    setOpenDr(false);
                    setShowOptions([]);
                  }}
                >
                  <Sheet.Container className="statisticBox phone-number-dropdown">
                    <Sheet.Header />
                    <Sheet.Content>
                      {openDr && (
                        <div className="drawer-swipe-wrapper">
                          <div className="filter-option">
                            {showOptions?.map((data, key) => (
                              <div
                                key={`${data.label}`}
                                className={`yourself-option form-check`}
                                onClick={() =>
                                  handleCheckboxChangeOnMobile(data)
                                }
                              >
                                <div
                                  className={`form-check-input check-input ${
                                    JSON.stringify(selectedOption) ===
                                    JSON.stringify(data)
                                      ? "selected"
                                      : ""
                                  }`}
                                />
                                <label className="form-check-label">
                                  {data.label}
                                </label>
                              </div>
                            ))}
                          </div>
                          <div className="edit-btn flex justify-center">
                            <button
                              type="button"
                              className="btn btn-primary mx-1"
                              onClick={
                                selectedOption
                                  ? () =>
                                      handlePhoneNumberMobile(selectedOption)
                                  : null
                              }
                            >
                              Save
                            </button>

                            <button
                              type="button"
                              class="btn mx-1 bg-gray text-white"
                              onClick={() => setOpenDr(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </Sheet.Content>
                  </Sheet.Container>
                  <Sheet.Backdrop />
                </Sheet>
              </>
            )}
          </div>
        </div>
        <div className="transaction-view">
          <div className="transaction">
            <div className="transaction-wrapper">
              <div className="transaction-number">{totalToken}</div>
              <div className="transaction-label">Token</div>
            </div>
            <div className="divider"></div>
            <div className="transaction-wrapper">
              <ThisMonthSale
                getUser={getUser}
                filterValue={filterValue}
                lineToken={lineToken}
                transactions={transactions}
                filterLabel={filterLabel}
              />
            </div>
          </div>
          <div className="transaction-chart">
            <StatisticsChart
              getUser={getUser}
              filterValue={filterValue}
              setTransactionData={setTransactionData}
              setTotalTokenValue={setTotalTokenValue}
              setLineGraphData={setLineGraphData}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TokenSale;
