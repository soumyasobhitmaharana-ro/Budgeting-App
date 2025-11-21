import { useEffect, useState } from "react";
import { prepareExpenseLineChartData } from "../util/chartUtils"; // you’ll need a helper like income one
import CustomLineChart from "./CustomLineChart";

const ExpenseOverview = ({ transactions }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseLineChartData(transactions);
    setChartData(result);
  }, [transactions]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 w-full">
      <h5 className="text-xl font-bold text-red-600">Expense Overview</h5>
      <p className="text-sm text-gray-500">
        Monitor your spending patterns and analyze where your money goes with
        this interactive chart.
      </p>
      <CustomLineChart data={chartData} name="Expense" />
    </div>
  );
};

export default ExpenseOverview;
