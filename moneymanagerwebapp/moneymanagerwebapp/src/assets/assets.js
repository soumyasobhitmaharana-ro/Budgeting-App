import logo from "./login-logo.png";
import loginbg from "./login-bg.jpg";
import signup from "./signup.jpg";

export const assets = {
  logo,
  loginbg,
  signup
};

import { LayoutDashboard, List, Wallet, Coins, FunnelPlus } from "lucide-react";

export const SIDE_BAR_DATA = 
   [
  {
    id: "01",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Category",
    icon: List,
    path: "/category",
  },
  {
    id: "03",
    label: "Income",
    icon: Wallet,
    path: "/income",
  },
  {
    id: "04",
    label: "Expense",
    icon: Coins,
    path: "/expense",
  },
  {
    id: "05",
    label: "Filter",
    icon: FunnelPlus,
    path: "/filter",
  }
];
