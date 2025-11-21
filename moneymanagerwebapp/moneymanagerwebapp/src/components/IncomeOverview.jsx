import { useEffect, useState } from "react";
import { prepareIncomeLineChartData } from "../util/chartUtils";
import CustomLineChart from "./CustomLineChart";

const IncomeOverview = ({ transactions }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareIncomeLineChartData(transactions);
    setChartData(result);
  }, [transactions]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 w-full">
      <h5 className="text-xl font-bold text-indigo-600">Income Overview</h5>
      <p className="text-sm text-gray-500">
        Track your earnings over time and analyze your income trends with this interactive chart.
      </p>
      <CustomLineChart data={chartData} name="Income" />
    </div>
  );
};

export default IncomeOverview;
