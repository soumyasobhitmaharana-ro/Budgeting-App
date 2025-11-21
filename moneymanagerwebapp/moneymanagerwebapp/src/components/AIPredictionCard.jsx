import React, { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Bot,
  TrendingUp,
  Target,
  Zap,
  Activity,
  AlertTriangle,
  Crown,
} from "lucide-react";
import { motion } from "framer-motion";

const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#6366f1"];

const AIPredictionCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.id) {
          const response = await axiosConfig.get(
            `/dashboard/ai-prediction/${user.id}`
          );
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching AI prediction:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-pulse h-96 flex items-center justify-center">
        <div className="text-violet-400 flex flex-col items-center gap-3">
          <Bot className="w-10 h-10 animate-bounce" />
          <span className="text-sm font-medium tracking-wider">
            AI ANALYZING FINANCIAL DATA...
          </span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // --- Data Preparation ---

  // 1. Line Chart: Last 6 months actuals + Next month prediction
  const rawHistory = data.monthlyExpenseHistory || [];
  // Take last 6 months from history
  const last6Months = rawHistory.slice(-6);

  const lineChartData = last6Months.map((amount, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (6 - index));
    return {
      month: date.toLocaleString("default", { month: "short" }),
      actual: amount,
      predicted: null, // No prediction for past
    };
  });

  // Add Next Month Prediction
  const nextMonthDate = new Date();
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  lineChartData.push({
    month: nextMonthDate.toLocaleString("default", { month: "short" }),
    actual: null,
    predicted: data.predictedExpenseNextMonth,
  });

  // 2. Category Data
  const categoryData = Object.entries(data.categorySpending || {}).map(
    ([name, value]) => ({
      name,
      value,
    })
  ).sort((a, b) => b.value - a.value);

  // Logic: > 3 categories -> Radar, <= 3 -> Donut
  const showRadar = categoryData.length > 3;
  const displayCategoryData = showRadar ? categoryData.slice(0, 6) : categoryData.slice(0, 3);

  // Radar Data Normalization
  const maxSpending = Math.max(...displayCategoryData.map(d => d.value), 1);
  const radarData = displayCategoryData.map(d => ({
    subject: d.name,
    A: (d.value / maxSpending) * 100,
    fullMark: 100,
  }));

  // 3. Confidence Data
  const confidenceValue =
    data.confidence === "High" ? 100 : data.confidence === "Medium" ? 60 : 30;

  const confidenceData = [
    { name: "Confidence", value: confidenceValue, fill: "#8b5cf6" },
    { name: "Remaining", value: 100 - confidenceValue, fill: "#334155" },
  ];

  // Sparkline Data (using history)
  const sparklineData = rawHistory.map((val, i) => ({ i, value: val }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-violet-950 rounded-3xl p-8 shadow-2xl border border-white/10 text-white w-full"
    >
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      {/* 1. Top Header */}
      <div className="relative flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
            <Bot className="w-8 h-8 text-violet-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">
                AI Forecast
              </h2>
              <div className="px-2 py-0.5 bg-gradient-to-r from-amber-200 to-amber-400 rounded text-[10px] font-bold text-slate-900 flex items-center gap-1">
                <Crown className="w-3 h-3" />
                PREMIUM
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Next Month Prediction
            </p>
          </div>
        </div>
      </div>

      {/* 2. Metric Cards (Glass Panels) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {/* Predicted Expense */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-violet-500/20 rounded-lg text-violet-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            {/* Floating animated value effect could be added here */}
          </div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Predicted Expense</p>
          <div className="text-2xl font-bold text-white mt-1">
            ₹{data.predictedExpenseNextMonth?.toLocaleString()}
          </div>
          {/* Mini Sparkline */}
          <div className="h-12 w-full mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="url(#sparkGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommended Saving Goal */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-300">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Saving Goal</p>
          <div className="text-2xl font-bold text-white mt-1">
            ₹{data.suggestedSavingGoal?.toLocaleString()}
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="bg-emerald-400 h-1.5 rounded-full"
            />
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 text-right">Recommended</p>
        </div>

        {/* Trend Direction */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${data.trend === 'UP' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {data.trend === 'UP' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            </div>
          </div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Trend</p>
          <div className="text-2xl font-bold text-white mt-1">
            {data.trend === 'UP' ? 'Increasing' : data.trend === 'DOWN' ? 'Decreasing' : 'Stable'}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Compared to last month
          </p>
        </div>

        {/* Confidence */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Confidence</p>
            <div className="text-2xl font-bold text-white">{data.confidence}</div>
            <p className="text-[10px] text-slate-500 mt-1">AI Certainty</p>
          </div>
          <div className="h-16 w-16 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                barSize={6}
                data={confidenceData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-violet-300">
              {confidenceValue}%
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* 4. 6-Month Line Chart */}
        <div className="col-span-2 bg-white/5 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-violet-400" />
            Expense Prediction vs Actual (6 months)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                {/* Actual Line */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#8b5cf6' }}
                  activeDot={{ r: 6 }}
                  name="Actual"
                />
                {/* Predicted Line (Dashed) */}
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#f59e0b' }}
                  name="Predicted"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Category Chart (Conditional: Radar or Donut) */}
        <div className="col-span-1 bg-white/5 rounded-2xl p-6 border border-white/5 backdrop-blur-sm flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            {showRadar ? <AlertTriangle className="w-4 h-4 text-amber-400" /> : <Sparkles className="w-4 h-4 text-pink-400" />}
            {showRadar ? "Category Risk Profile" : "Category Breakdown"}
          </h3>

          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              {showRadar ? (
                // Option B: Radar Chart
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Spending Risk"
                    dataKey="A"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="#f59e0b"
                    fillOpacity={0.5}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    formatter={(val) => [`${val.toFixed(0)}%`, 'Risk Score']}
                  />
                </RadarChart>
              ) : (
                // Option A: Donut Chart
                <PieChart>
                  <Pie
                    data={displayCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {displayCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    formatter={(val) => `₹${val}`}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>

            {/* Center Text for Donut */}
            {!showRadar && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-500">Top</span>
                <span className="text-sm font-bold text-white">Spend</span>
              </div>
            )}
          </div>

          {/* Legend for Donut */}
          {!showRadar && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {displayCategoryData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1 text-[10px] text-slate-400">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. AI Analysis Box */}
      <div className="bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-indigo-600/20 rounded-2xl p-6 border border-violet-500/20 flex items-start gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap className="w-32 h-32 text-white" />
        </div>
        <div className="p-3 bg-violet-500/20 rounded-xl shrink-0 z-10">
          <Zap className="w-6 h-6 text-violet-300" />
        </div>
        <div className="z-10">
          <h3 className="text-lg font-bold text-white mb-1">AI Strategic Insight</h3>
          <p className="text-violet-200 text-sm leading-relaxed">
            {data.reason || "AI is analyzing your spending patterns to provide personalized insights."}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span className="px-2 py-1 bg-white/5 rounded border border-white/5">
              Slope: {data.trend === 'UP' ? '+' : '-'}{Math.abs(data.trend === 'UP' ? 1.2 : 0.8).toFixed(1)}
            </span>
            <span className="px-2 py-1 bg-white/5 rounded border border-white/5">
              Variance: Low
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIPredictionCard;
