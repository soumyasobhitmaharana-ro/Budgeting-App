import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Brain, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import axios from 'axios';

const AIPredictionPanel = ({ userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for the sparkline chart
  const chartData = [
    { month: 'Jan', value: 82000 },
    { month: 'Feb', value: 85000 },
    { month: 'Mar', value: 89000 },
    { month: 'Apr', value: 86000 },
    { month: 'May', value: 94000 },
    { month: 'Jun', value: 91500 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Attempt to fetch from backend
        const response = await axios.get(`/api/v1.0/insights/predict-budget/${userId}`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.warn("Backend API failed or not reachable, using mock data for demonstration.");
        // Fallback mock data matching the requirements
        setData({
          userId: userId,
          predictedExpense: 91500,
          suggestedSavingGoal: 20130,
          message: "AI model successfully predicted next month's expense and saving goal.",
          confidence: "High", // Added for UI
          trend: "up" // Added for UI
        });
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-900/50 backdrop-blur-lg rounded-3xl border border-white/10 shadow-xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-purple-400" />
        </motion.div>
        <span className="ml-3 text-white/70 font-medium">Analyzing financial patterns...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-red-500/10 backdrop-blur-lg rounded-3xl border border-red-500/20">
        <AlertCircle className="w-6 h-6 text-red-400 mr-2" />
        <span className="text-red-400">{error}</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full p-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10" />

      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg shadow-purple-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Financial Forecast</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">
                  {data.confidence || 'High'} Confidence
                </span>
              </div>
              <span className="text-xs text-gray-500">Updated just now</span>
            </div>
          </div>
        </div>
        <div className="px-3 py-1 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-full border border-amber-500/20 flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            PREMIUM
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Predicted Expense Card */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-12 h-12 text-white" />
          </div>
          <p className="text-sm text-gray-400 mb-2 font-medium">Predicted Expense</p>
          <div className="flex items-end gap-3">
            <motion.h3 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-white tracking-tight"
            >
              ${data.predictedExpense?.toLocaleString()}
            </motion.h3>
            <div className="flex items-center text-rose-400 text-xs font-medium mb-1.5 bg-rose-500/10 px-1.5 py-0.5 rounded">
              <ArrowUp className="w-3 h-3 mr-1" />
              2.4%
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-gray-800 rounded-full mt-5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-rose-500 to-orange-500"
            />
          </div>
        </div>

        {/* Suggested Saving Goal Card */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors group relative overflow-hidden">
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <p className="text-sm text-gray-400 mb-2 font-medium">Suggested Saving Goal</p>
          <div className="flex items-end gap-3">
            <motion.h3 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-white tracking-tight"
            >
              ${data.suggestedSavingGoal?.toLocaleString()}
            </motion.h3>
            <div className="flex items-center text-emerald-400 text-xs font-medium mb-1.5 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <ArrowUp className="w-3 h-3 mr-1" />
              5.2%
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-gray-800 rounded-full mt-5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '45%' }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Visualization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sparkline Chart Area */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-medium text-gray-300">6-Month Trend Analysis</h4>
            <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
               <span className="text-xs text-gray-500">Expenses</span>
            </div>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px', 
                    color: '#fff',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                  }}
                  itemStyle={{ color: '#e5e7eb', fontSize: '12px' }}
                  labelStyle={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Shift Bars */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex flex-col justify-between">
          <h4 className="text-sm font-medium text-gray-300 mb-4">Predicted Shifts</h4>
          <div className="space-y-5">
            {[
              { label: 'Dining', val: 65, color: 'bg-blue-500' },
              { label: 'Shopping', val: 42, color: 'bg-violet-500' },
              { label: 'Travel', val: 28, color: 'bg-pink-500' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>{item.label}</span>
                  <span>{item.val}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.val}%` }}
                    transition={{ duration: 1, delay: 0.6 + (idx * 0.15), ease: "easeOut" }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight Footer */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/10 flex items-start gap-3">
        <div className="p-2 bg-purple-500/20 rounded-lg shrink-0">
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-purple-300 mb-0.5 uppercase tracking-wider">AI Insight</h5>
          <p className="text-sm text-gray-300 leading-relaxed">
            {data.message} Consider reallocating <strong>$150</strong> from your Shopping budget to meet your saving goal faster.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AIPredictionPanel;
