const SummaryCards = ({ totalIncome, totalExpense, totalBalance }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-green-100 p-5 rounded-lg shadow">
        <h3 className="text-green-700 font-semibold">Total Income</h3>
        <p className="text-2xl font-bold text-green-800">₹{totalIncome.toFixed(2)}</p>
      </div>
      <div className="bg-red-100 p-5 rounded-lg shadow">
        <h3 className="text-red-700 font-semibold">Total Expense</h3>
        <p className="text-2xl font-bold text-red-800">₹{totalExpense.toFixed(2)}</p>
      </div>
      <div className="bg-blue-100 p-5 rounded-lg shadow">
        <h3 className="text-blue-700 font-semibold">Balance</h3>
        <p className="text-2xl font-bold text-blue-800">₹{totalBalance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SummaryCards;
