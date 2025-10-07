import Dashboard from "../components/Dashboard";
import { DashboardData } from "../hooks/DashboardData";
import SummaryCards from "../components/SummaryCards";
import FinanceOverview from "../components/FinanceOverview";
import RecentTransactions from "../components/RecentTransactions";

const Home = () => {
  const { data, loading } = DashboardData();

  if (loading) return <p className="text-center mt-5">Loading...</p>;

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

        {/* Recent Transactions */}
        <RecentTransactions transactions={data.recentTransactions} />
      </div>
    </Dashboard>
  );
};

export default Home;
