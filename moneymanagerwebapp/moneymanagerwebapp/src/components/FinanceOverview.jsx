import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const FinanceOverview = ({ totalIncome, totalExpense, totalBalance }) => {
  const chartData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#4ade80", "#f87171"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="bg-white shadow rounded-xl p-5 w-full md:w-[400px] mx-auto">
      <h3 className="text-xl font-bold text-indigo-600 mb-4">Finance Overview</h3>
      <div className="flex justify-around mb-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="font-bold text-green-500">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Expense</p>
          <p className="font-bold text-red-500">₹{totalExpense.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Balance</p>
          <p className="font-bold text-indigo-600">₹{totalBalance.toLocaleString()}</p>
        </div>
      </div>
      <div className="h-52">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default FinanceOverview;
