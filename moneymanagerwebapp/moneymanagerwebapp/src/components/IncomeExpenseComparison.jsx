import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const IncomeExpenseComparison = ({ data }) => {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-xl font-bold text-purple-600 mb-4">Income vs Expense Trend</h3>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, bottom: 60, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
              tickFormatter={(value) => {
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
            <Legend />
            <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseComparison;

