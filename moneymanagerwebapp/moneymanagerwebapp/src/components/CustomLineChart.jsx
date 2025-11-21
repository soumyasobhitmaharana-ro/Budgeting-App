// components/CustomLineChart.jsx
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

const CustomLineChart = ({ data, name = "Amount" }) => {
  return (
    <div className="w-full h-80 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl shadow-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, bottom: 10, left: 0 }}
        >
          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" />

          {/* X & Y axis */}
          <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            formatter={(value) => [`₹${value}`, name]}
          />

          {/* Gradient fills */}
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="15%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="15%" stopColor="#ec4899" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Area under curve */}
          <Area
            type="monotone"
            dataKey="amount"
            stroke="none"
            fill="url(#colorIncome)"
            tooltipType="none"
          />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="amount"
            name={name}
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 5, fill: "#6366f1", stroke: "white", strokeWidth: 2 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
