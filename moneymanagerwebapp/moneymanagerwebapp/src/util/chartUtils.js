// utils/chartUtils.js

// For Income
export const prepareIncomeLineChartData = (transactions = []) => {
  const map = {};

  transactions.forEach((t) => {
    if (!t.date) return;
    const date = new Date(t.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
    map[date] = (map[date] || 0) + Number(t.amount);
  });

  return Object.keys(map).map((date) => ({
    date,
    amount: map[date],
  }));
};

// For Expenses
export const prepareExpenseLineChartData = (transactions = []) => {
  const map = {};

  transactions.forEach((t) => {
    if (!t.date) return;
    const date = new Date(t.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
    map[date] = (map[date] || 0) + Number(t.amount);
  });

  return Object.keys(map).map((date) => ({
    date,
    amount: map[date],
  }));
};
