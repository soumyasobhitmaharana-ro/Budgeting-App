import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CategorySpendingChart = ({ data }) => {
  // Color palette for categories
  const colors = [
    "#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6",
    "#ef4444", "#8b5cf6", "#f97316", "#06b6d4", "#84cc16"
  ];

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-xl font-bold text-purple-600 mb-4">Category Spending</h3>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, bottom: 60, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="category" 
              stroke="#6b7280" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
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
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategorySpendingChart;

