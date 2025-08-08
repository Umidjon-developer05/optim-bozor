import { Banknote, Settings2, Shuffle, User } from "lucide-react";

export const categories = [
  "All",
  "Shoes",
  "T-Shirts",
  "Clothes",
  "Books",
  "Accessories",
  "Universal",
];

export const dashboardSidebar = [
  { name: "Sizning Malumotlaringiz", route: "/dashboard", icon: User },
  { name: "Buyurtmalar", route: "/dashboard/orders", icon: Shuffle },
  { name: "To'lovlar", route: "/dashboard/payments", icon: Banknote },
  { name: "Sozlamalar", route: "/dashboard/settings", icon: Settings2 },
];

export const TransactionState = {
  Paid: 2,
  Pending: 1,
  PendingCanceled: -1,
  PaidCanceled: -2,
};
