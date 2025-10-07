const RecentTransactions = ({ transactions }) => {
  if (!transactions || transactions.length === 0)
    return <p>No recent transactions</p>;

  return (
    <div className="bg-white p-5 rounded-lg shadow overflow-x-auto">
      <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-right">Amount</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{t.icon} {t.name}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded text-white ${t.type === "Income" ? "bg-green-500" : "bg-red-500"}`}>
                  {t.type}
                </span>
              </td>
              <td className="px-4 py-2 text-right font-semibold">₹{t.amount}</td>
              <td className="px-4 py-2">{new Date(t.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;
