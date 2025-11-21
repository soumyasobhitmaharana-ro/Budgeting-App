import { TrendingUp, TrendingDown } from "lucide-react";

const AnalyticsSummaryCards = ({ 
  thisMonthSpending, 
  thisMonthIncome, 
  highestCategory, 
  changeFromLastMonth 
}) => {
  const isPositive = changeFromLastMonth >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* This Month's Spending */}
      <div className="bg-white shadow rounded-xl p-5 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">This Month's Spending</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{thisMonthSpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* This Month's Income */}
      <div className="bg-white shadow rounded-xl p-5 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">This Month's Income</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{thisMonthIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Highest Spending Category */}
      <div className="bg-white shadow rounded-xl p-5 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Highest Spending Category</p>
            <p className="text-xl font-bold text-gray-900 truncate">
              {highestCategory?.name || "N/A"}
            </p>
              {highestCategory && (
              <p className="text-sm text-gray-500 mt-1">
                ₹{highestCategory.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">{highestCategory?.icon || "📊"}</span>
          </div>
        </div>
      </div>

      {/* % Change from Last Month */}
      <div className="bg-white shadow rounded-xl p-5 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">% Change from Last Month</p>
            <p className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? "+" : ""}{changeFromLastMonth.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Spending change</p>
          </div>
          <div className={`w-12 h-12 ${isPositive ? "bg-green-100" : "bg-red-100"} rounded-full flex items-center justify-center`}>
            {isPositive ? (
              <TrendingUp className={`w-6 h-6 ${isPositive ? "text-green-600" : "text-red-600"}`} />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSummaryCards;

