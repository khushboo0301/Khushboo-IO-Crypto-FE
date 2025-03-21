import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import React, { useEffect, useState } from "react";
import { DownArrowIcon, UpArrowIcon } from "./SVGIcon";
import moment from "moment";
import { useSelector } from "react-redux";
import { userDetails } from "../store/slices/AuthSlice";
import jwtAxios from "../service/jwtAxios";
import axios from "axios";
import apiConfigs from "../service/config";

// this component is used for token sale graph 
export const ThisMonthSale = (props) => {
  const { getUser } = props;
  const [prevTransaction, SetPreviousTransaction] = useState([]);
  const [transactionMainData, setTransactionMainData] = useState([]);
  const [isIncreased, setIsIncreased] = useState(false);
  const [percentage, setPercentage] = useState(0);
  
  useEffect(() => {
    const tarnsArray1 = props?.transactions?.map((trans) => trans.value);
    const tarnsArray2 = prevTransaction.map((trans) => trans.value);
    setTransactionMainData(tarnsArray2.concat(tarnsArray1));
    const tarnsArray1Sum = tarnsArray1.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const tarnsArray2Sum = tarnsArray2.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    let change = (tarnsArray1Sum / tarnsArray2Sum) * 100;
    if (isNaN(change)) {
      change = 0;
    }
    let cal = 0;
    if (change != 0) {
      cal = Math.abs(change).toFixed(2);
    }
    if (cal === "Infinity") {
      setPercentage(100);
    } else {
      setPercentage(cal);
    }
    if (tarnsArray1Sum >= tarnsArray2Sum) {
      setIsIncreased(true);
    } else {
      setIsIncreased(false);
      const percentage = (tarnsArray1Sum / tarnsArray2Sum) * 100;
    }
  }, [props?.transactions, prevTransaction]);
  
  const acAddress = useSelector(userDetails);
  const colors = isIncreased ? ["#7FFC8D"] : ["#FF3F3F"];
  const options = {
    chart: {
      type: "spline",
      colors: colors,
      height: 50,
      width: 80,
      backgroundColor: null,
      margin: [15, 10, 10, 0],
    },
    colors: colors,
    title: {
      text: null,
    },
    tooltip: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
    },
    series: [
      {
        showInLegend: false,
        data: transactionMainData ? transactionMainData : [0],
      },
    ],
  };

  const transactionData = async (filter) => {
    let from_date = null;
    let to_date = null;
    const today = moment();
    if (filter === "thisWeekDate") {
      moment.updateLocale("en", {
        week: {
          dow: 0,
        },
      });
      const startOfPreviousWeek = moment(today)
        .subtract(1, "week")
        .startOf("week");
      const endOfPreviousWeek = moment(startOfPreviousWeek).endOf("week");
      from_date = startOfPreviousWeek
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      to_date = endOfPreviousWeek.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
    } else if (filter === "lastWeek") {
      moment.updateLocale("en", {
        week: {
          dow: 0,
        },
      });
      const startOfPreviousWeek = moment(today)
        .subtract(2, "week")
        .startOf("week");
      const endOfPreviousWeek = moment(startOfPreviousWeek).endOf("week");
      from_date = startOfPreviousWeek
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      to_date = endOfPreviousWeek.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
    } else if (filter === "lastMonth") {
      const startOfPreviousMonth = moment()
        .subtract(2, "month")
        .startOf("month");
      const endOfPreviousMonth = moment().subtract(2, "month").endOf("month");
      from_date = startOfPreviousMonth
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      to_date = endOfPreviousMonth.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
    } else if (filter === "last3Months") {
      const startOfPreviousToPreviousThreeMonths = moment()
        .subtract(6, "months")
        .startOf("month");

      const endOfPreviousToPreviousMonth = moment()
        .subtract(4, "months")
        .endOf("month");

      from_date = startOfPreviousToPreviousThreeMonths
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");

      to_date = endOfPreviousToPreviousMonth
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
    } else if (filter === "last6Months") {
      const startOfPreviousSixMonths = moment()
        .subtract(12, "months")
        .startOf("month");
      const endOfPreviousMonth = moment().subtract(7, "month").endOf("month");
      from_date = startOfPreviousSixMonths
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      to_date = endOfPreviousMonth.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
    } else if (filter === "lastYear") {
      const startOfPreviousYear = moment().subtract(2, "year").startOf("year");
      const endOfPreviousYear = moment().subtract(2, "year").endOf("year");
      from_date = startOfPreviousYear
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      to_date = endOfPreviousYear.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
    } else if (filter === "thisMonthDate") {
      const startOfThisMonth = moment().subtract(1, "month").startOf("month");
      const endOfThisMonth = moment().subtract(1, "month").endOf("month");
      from_date = startOfThisMonth
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      to_date = endOfThisMonth.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
    } else if (filter === "thisYearDate") {
      const startOfThisYear = moment().subtract(1, "year").startOf("year");
      const endOfThisYear = moment().subtract(1, "year").endOf("year");
      from_date = startOfThisYear
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      to_date = endOfThisYear.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
    }
    if (
      acAddress?.authToken && getUser &&
      getUser?.is_2FA_verified === true
    ) {
      await jwtAxios
        .post(`/transactions/getLineGrapthValues`, {
          option: filter,
          from_date: from_date,
          to_date: to_date,
        })
        .then((response) => {
          SetPreviousTransaction(response?.data?.transactionData);
        });
    } 
    if(!acAddress?.authToken || (getUser && getUser?.is_2FA_verified === false)){
      await axios
        .post(`${apiConfigs.API_URL}auth/getLineGrapthValues`, {
          option: filter,
          from_date: from_date,
          to_date: to_date,
        })
        .then((response) => {
          SetPreviousTransaction(response?.data?.transactionData);
        });
    }
  };
  useEffect(() => {
    if (props?.filterValue) {
      transactionData(props?.filterValue);
    }
  }, [props?.filterValue, acAddress?.authToken, getUser?.is_2FA_verified]);

  return (
    <>
      <div className="d-inline-flex position-relative align-items-end">
        <HighchartsReact highcharts={Highcharts} options={options} />
        {isIncreased ? (
          <>
            <div className="month-arrow">
              <UpArrowIcon width="16" height="16" /> {percentage}%
            </div>
          </>
        ) : (
          <div className="month-arrow">
            <DownArrowIcon width="16" height="16" />
            <span style={{ color: "#FF3F3F" }}>{percentage}% </span>
          </div>
        )}
      </div>
      <div className="charts-label">{props.filterLabel}</div>
    </>
  );
};

export default ThisMonthSale;
