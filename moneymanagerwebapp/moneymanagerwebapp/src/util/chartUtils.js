// utils/chartUtils.js

// For Income
// For Income
export const prepareIncomeLineChartData = (transactions = []) => {
  const map = {};

  transactions.forEach((t) => {
    if (!t.date) return;
    // Group by YYYY-MM for sorting
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map[key] = (map[key] || 0) + Number(t.amount);
  });

  return Object.keys(map)
    .sort() // Sort by YYYY-MM
    .map((key) => {
      const [year, month] = key.split("-");
      // Format as "Oct 2025" for display
      const date = new Date(year, month - 1).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      return {
        date,
        amount: map[key],
      };
    });
};

// For Expenses
export const prepareExpenseLineChartData = (transactions = []) => {
  const map = {};

  transactions.forEach((t) => {
    if (!t.date) return;
    // Group by YYYY-MM for sorting
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map[key] = (map[key] || 0) + Number(t.amount);
  });

  return Object.keys(map)
    .sort() // Sort by YYYY-MM
    .map((key) => {
      const [year, month] = key.split("-");
      // Format as "Oct 2025" for display
      const date = new Date(year, month - 1).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      return {
        date,
        amount: map[key],
      };
    });
};
