import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import React, { useEffect, useState } from "react";
import jwtAxios from "../service/jwtAxios";
import moment from "moment";
import { userDetails } from "../store/slices/AuthSlice";
import { useSelector } from "react-redux";
import apiConfigs from "../service/config";
import axios from "axios";

//this component is used for Token graph(StatisticsChart) for desktop view
export const StatisticsChart = (props) => {
  const { getUser } = props;
  const colors = ["#ffffff"];
  const filter = props?.filterValue;
  const [transactionsAll, setTransactionData] = useState([]);
  const [categoryLabel, setCategoryLabel] = useState([]);
  const [categoryValue, setCategoryValue] = useState([]);
  const [yAxisPosition, setYAxisPosition] = useState(true);
  const acAddress = useSelector(userDetails);
  
  const transactionData = async (filter) => {
    let from_date = null;
    let to_date = null;
    const today = moment();
    if (filter === "thisWeekDate") {
      from_date = today.startOf("week").format("YYYY-MM-DDT00:00:00+05:30");
      to_date = today.endOf("week").format("YYYY-MM-DDT23:59:59+05:30");
    } else if (filter === "lastWeek") {
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
    } else if (filter === "lastMonth") {
      const startOfPreviousMonth = moment()
        .subtract(1, "month")
        .startOf("month");
      const endOfPreviousMonth = moment().subtract(1, "month").endOf("month");
      from_date = startOfPreviousMonth
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      to_date = endOfPreviousMonth.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
    } else if (filter === "last3Months") {
      const startOfPreviousThreeMonths = moment()
        .subtract(3, "months")
        .startOf("month");
      const endOfPreviousMonth = moment().subtract(1, "month").endOf("month");
      from_date = startOfPreviousThreeMonths
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      to_date = endOfPreviousMonth.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
    } else if (filter === "last6Months") {
      const startOfPreviousSixMonths = moment()
        .subtract(6, "months")
        .startOf("month");
      const endOfPreviousMonth = moment().subtract(1, "month").endOf("month");
      from_date = startOfPreviousSixMonths
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      to_date = endOfPreviousMonth.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
    } else if (filter === "lastYear") {
      const startOfPreviousYear = moment().subtract(1, "year").startOf("year");
      const endOfPreviousYear = moment().subtract(1, "year").endOf("year");
      from_date = startOfPreviousYear
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      to_date = endOfPreviousYear.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
    } else if (filter === "thisMonthDate") {
      // Calculate start and end dates of the current month
      from_date = today.startOf("month").format("YYYY-MM-DDT00:00:00+05:30");
      to_date = today.endOf("month").format("YYYY-MM-DDT23:59:59+05:30");
    } else if (filter === "thisYearDate") {
      // Calculate start and end dates of the current year
      from_date = today.startOf("year").format("YYYY-MM-DDT00:00:00+05:30");
      to_date = today.endOf("year").format("YYYY-MM-DDT23:59:59+05:30");
    }

    if (
      acAddress?.authToken && getUser &&
      getUser?.is_2FA_verified === true && acAddress?.account
    ) {
      await jwtAxios
        .post(`/transactions/getSaleGrapthValues`, {
          option: filter,
          from_date: from_date,
          to_date: to_date,
        })
        .then((response) => {
          setTransactionData(response?.data?.transactionData);
          props.setTransactionData(response?.data?.transactionData);
          props.setTotalTokenValue(response?.data?.totalToken);
          props.setLineGraphData(response?.data?.totalToken);
        });
    } 
    if(!acAddress?.authToken || (getUser && getUser?.is_2FA_verified === false)){
      await axios
        .post(`${apiConfigs.API_URL}auth/getSaleGrapthValues`, {
          option: filter,
          from_date: from_date,
          to_date: to_date,
        })
        .then((response) => {
          setTransactionData(response?.data?.transactionData);
          props.setTransactionData(response?.data?.transactionData);
          props.setTotalTokenValue(response?.data?.totalToken);
          props.setLineGraphData(response?.data?.totalToken);
        });
    }
  };
  useEffect(() => {
    if (filter) {
      transactionData(filter);
    }
  }, [filter, acAddress?.authToken, getUser?.is_2FA_verified]);

  useEffect(() => {
    if (transactionsAll) {
      setCategoryLabel([]);
      setCategoryValue([]);
      setYAxisPosition(true);
      transactionsAll?.map((val) => {
        let label = val.label;
        if (
          filter === "last3Months" ||
          filter === "last6Months" ||
          filter === "lastYear" ||
          filter === "thisYearDate"
        ) {
          label = moment(val.label, "YYYY-MM").format("MMM");
        } else if (filter === "lastWeek" || filter === "thisWeekDate") {
          label = moment(val.label, "YYYY-MM-DD").format("ddd");
        } else if (filter === "lastMonth" || filter === "thisMonthDate") {
          label = moment(val.label, "YYYY-MM-DD").format("D");
        }
        if (val.value > 0) {
          setYAxisPosition(false);
        }
        setCategoryLabel((prevArray) => [...prevArray, label]);
        setCategoryValue((prevArray) => [...prevArray, val.value]);
      });
    }
  }, [transactionsAll]);

  const options = {
    chart: {
      type: "column",
      colors: colors,
      height: 150,
      backgroundColor: null,
    },
    colors: colors,
    xAxis: {
      //categories: categoryLabel !== [] && categoryLabel,
      categories: categoryLabel.length !== 0 && categoryLabel,
      labels: {
        style: {
          fontWeight: 500,
          color: "#fff",
          fontSize: 10,
          fontFamily: "eudoxus sans",
        },
      },
      lineColor: "transparent",
    },
    yAxis: {
      tickPositions: yAxisPosition ? [0, 1, 2, 3] : null,
      crosshair: {
        snap: true,
        color: "#ffffff20",
      },
      gridLineColor: "transparent",
      title: false,
      labels: {
        step: 1,
        style: {
          fontWeight: 500,
          color: "#fff",
          fontSize: 13,
          fontFamily: "eudoxus sans",
        },
      },
    },
    title: {
      text: null,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      line: {
        marker: {
          // height:"0px",
          radius: 0,
          states: {
            hover: {
              radius: 4,
              fillColor: "#affa67",
            },
            normal: {
              fillColor: "#1b1c1f",
            },
          },
        },
      },
      series: {
        borderRadius: 3.5,
        pointWidth: 4,
      },
    },

    tooltip: {
      borderRadius: 20,
      backgroundColor: "#25272D",
      borderColor: "#25272D",
      // padding: 30,
      style: {
        color: "#fff",
        fontSize: "13px",
        fontWeight: 700,
      },
      shared: true,
      formatter: function () {
        return this.y + " " + "Token";
      },
    },
    series: [
      {
        showInLegend: false,
        //data: categoryValue !== [] ? categoryValue : [],
        data: categoryValue.length !== 0 ? categoryValue : [],

      },
      {
        type: "line",
        color: "transperant",
        showInLegend: false,
        // data: categoryValue !== [] ? categoryValue : [],
        data: categoryValue.length !== 0 ? categoryValue : [],

      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 350,
          },
        },
      ],
    },
  };

  return (
    <HighchartsReact highcharts={Highcharts} options={options} height="100%" />
  );
};

export default StatisticsChart;
