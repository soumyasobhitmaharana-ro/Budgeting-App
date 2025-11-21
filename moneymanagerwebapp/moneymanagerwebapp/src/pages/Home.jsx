import Dashboard from "../components/Dashboard";
import { DashboardData } from "../hooks/DashboardData";
import SummaryCards from "../components/SummaryCards";
import FinanceOverview from "../components/FinanceOverview";
import RecentTransactions from "../components/RecentTransactions";
import AnalyticsSummaryCards from "../components/AnalyticsSummaryCards";
import MonthlySpendingTrend from "../components/MonthlySpendingTrend";
import CategorySpendingChart from "../components/CategorySpendingChart";
import IncomeExpenseComparison from "../components/IncomeExpenseComparison";
import AIPredictionCard from "../components/AIPredictionCard";
import {
  prepareMonthlySpendingTrend,
  prepareCategorySpending,
  prepareIncomeExpenseComparison,
  calculateThisMonthSpending,
  calculateThisMonthIncome,
  findHighestSpendingCategory,
  calculateChangeFromLastMonth,
} from "../util/analyticsUtils";
import React from "react";

const Home = () => {
  const { data, loading } = DashboardData();

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  // Prepare analytics data
  const monthlySpendingData = prepareMonthlySpendingTrend(data.allExpenses || []);
  const categorySpendingData = prepareCategorySpending(
    data.allExpenses || [],
    data.categories || []
  );
  const incomeExpenseData = prepareIncomeExpenseComparison(
    data.allIncomes || [],
    data.allExpenses || []
  );
  const thisMonthSpending = calculateThisMonthSpending(data.allExpenses || []);
  const thisMonthIncome = calculateThisMonthIncome(data.allIncomes || []);
  const highestCategory = findHighestSpendingCategory(
    data.allExpenses || [],
    data.categories || []
  );
  const changeFromLastMonth = calculateChangeFromLastMonth(data.allExpenses || []);

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="p-5 space-y-8">
        {/* Summary Cards */}
        <SummaryCards
          totalIncome={data.totalIncome}
          totalExpense={data.totalExpense}
          totalBalance={data.totalBalance}
        />

        {/* Finance Overview */}
        <FinanceOverview
          totalIncome={data.totalIncome}
          totalExpense={data.totalExpense}
          totalBalance={data.totalBalance}
        />

        {/* Analytics Summary Cards */}
        <AnalyticsSummaryCards
          thisMonthSpending={thisMonthSpending}
          thisMonthIncome={thisMonthIncome}
          highestCategory={highestCategory}
          changeFromLastMonth={changeFromLastMonth}
        />

        <AIPredictionCard />

        {/* Monthly Spending Trend */}
        <MonthlySpendingTrend data={monthlySpendingData} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Spending */}
          <CategorySpendingChart data={categorySpendingData} />

          {/* Income vs Expense Comparison */}
          <IncomeExpenseComparison data={incomeExpenseData} />
        </div>

        {/* Recent Transactions */}
        <RecentTransactions transactions={data.recentTransactions} />
      </div>
    </Dashboard>
  );
};

export default Home;
