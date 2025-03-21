import moment from "moment";

export const truncateAddress = (address) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const toHex = (num) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

export const hideAddress = (address, keep) => {
  if (address && address !== "Connect Wallet") {
    let str = address;
    var len = str.length,
      re = new RegExp(
        "(.{" + keep + "})(.{" + (len - keep * 2) + "})(.{" + keep + "})",
        "g"
      );
    return str.replace(re, function (match, a, b, c) {
      return a + "***" + c;
    });
  } else {
    return "Connect Wallet";
  }
};

export const Timestamp = (date) => {
  const timestamp = new Date(date);
  const options = { month: "short", day: "numeric", year: "numeric" };

  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedTime = `${formattedHours}:${formattedMinutes} ${amPm}`;
  const formattedDateTime = `${formattedTime}`;

  return formattedDateTime;
};

export const formattedNumber = (number) => {
  const num = parseFloat(number);
  const formattedNumber = num.toFixed(2);
  return formattedNumber;
};

export const getDateFormate = (created_date,dateFormat = null) => {
  if(!created_date)
  {
    return null;
  }
  if(!dateFormat)
  {
    dateFormat = "YYYY-MM-DD hh:mm A"
  }
  const originalDate = moment.utc(created_date);
  let localDate = originalDate.local();
  const formattedDate = localDate.format(dateFormat);
  return formattedDate; // Output: 2023-01-01 10:20 PM
};

export const getDateFormateString = (created_date) => {
  const dateString = created_date;
  const date = new Date(dateString);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Format the date
  const formattedDate = `${
    monthNames[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()} ${padZero(
    date.getHours()
  )}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
  return formattedDate; // Output: May 29, 2023 06:26:55
};
function padZero(num) {
  return num.toString().padStart(2, "0");
}
