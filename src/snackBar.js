import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SnackBar = () => {
  const notification = useSelector((state) => state.notificationReducer);

  function guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  }

  useEffect(() => {
    if (notification?.type) {
      const op = {
        newestOnTop: true,
        theme: "dark",
        position: "bottom-right",
        closeOnClick: true,
        autoClose: 2000,
        hideProgressBar: true,
        transition: Slide,
        toastId: guidGenerator(),
      };

      switch (notification.type) {
        case "error":
          toast.dismiss();
          toast.error(notification.message, op);
          break;
        case "success":
          toast.dismiss();
          toast.success(notification.message, op);
          break;
        default:
          break;
      }
    }
  }, [notification]);
};

export default SnackBar;
