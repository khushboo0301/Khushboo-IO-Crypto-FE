import BuyTokenComponent from "./layout/BuyTokenComponent";
import DashboardComponent from "./layout/DashboardComponent";
import IcoDistributionComponent from "./layout/IcoDistributionComponent";
import ProfileComponent from "./layout/ProfileComponent";
import StakeScallopComponent from "./layout/StakeScallopComponent";
import TransactionComponent from "./layout/TransactionComponent";

export const routesList = [
  { id: "menu-home", path: "/", element: <DashboardComponent /> },
  { id: "menu-buy-token", path: "/buy-token", element: <BuyTokenComponent /> },
  {
    id: "menu-distribution",
    path: "/ico-distribution",
    element: <IcoDistributionComponent />,
  },
  { id: "menu-staking", path: "/staking", element: <StakeScallopComponent /> },
  {
    id: "menu-transaction",
    path: "/transaction",
    element: <TransactionComponent />,
  },
  { id: "menu-profile", path: "/profile", element: <ProfileComponent /> },
];
