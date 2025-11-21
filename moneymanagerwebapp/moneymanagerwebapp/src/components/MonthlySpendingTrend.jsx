import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

const MonthlySpendingTrend = ({ data }) => {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-xl font-bold text-purple-600 mb-4">Monthly Spending Trend</h3>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, bottom: 10, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                // Format YYYY-MM to "MMM YY"
                const [year, month] = value.split("-");
                const date = new Date(year, month - 1);
                return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
              }}
            />
            <YAxis 
              stroke="#6b7280" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `₹${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => `₹${value.toLocaleString()}`}
            />
            <defs>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="15%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="expense" stroke="none" fill="url(#colorSpending)" />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#a855f7"
              strokeWidth={3}
              dot={{ r: 5, fill: "#a855f7", stroke: "white", strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlySpendingTrend;

