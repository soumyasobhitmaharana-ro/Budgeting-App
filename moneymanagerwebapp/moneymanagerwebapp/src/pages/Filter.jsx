import { useState } from "react";
import Dashboard from "../components/Dashboard";
import useUser from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { TrendingUp, TrendingDown, Search } from "lucide-react";

// format numbers with commas
const addThousandsSeparator = (num) => {
  if (!num) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// format date like "12th Jul 2025"
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month} ${year}`;
};

const Filter = () => {
  useUser();

  const [type, setType] = useState("income");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortField, setSortField] = useState("amount");
  const [sortOrder, setSortOrder] = useState("desc");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilter = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosConfig.post(API_ENDPOINTS.FILTER, {
        type,
        startDate: startDate || null,
        endDate: endDate || null,
        keyword,
        sortField,
        sortOrder,
      });

      // ✅ Add type to every item (income/expense)
      const dataWithType = res.data.map((item) => ({
        ...item,
        type,
      }));

      setResults(dataWithType);
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard activeMenu="Filter">
      <h2 className="text-xl font-bold mb-4">Filter Transactions</h2>

      {/* Filter Box */}
      <form
        onSubmit={handleFilter}
        className="bg-white shadow rounded-xl p-4 mb-6"
      >
        <h3 className="text-md font-semibold mb-3">Select the filters</h3>
        <div className="flex gap-4 flex-wrap">
          {/* Type */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* Sort Field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Sort Field</label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Sort Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex flex-col flex-1">
            <label className="text-sm font-medium">Search</label>
            <div className="flex items-center border rounded">
              <input
                type="text"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1 p-2 rounded-l outline-none"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white p-2 rounded-r hover:bg-purple-700 transition"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Results */}
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-md font-semibold mb-3">Transactions</h3>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            {results.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
              >
                {/* Left side: Icon + Title + Date */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-lg">
                    {/* Emoji from DB */}
                    {item.icon || item.category?.icon || "💰"}
                  </div>
                  <div className="flex flex-col">
                    <h6 className="text-sm font-semibold text-gray-900">
                      {item.name || item.category?.name || "Untitled"}
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(item.date)}
                    </p>
                  </div>
                </div>

                {/* Right side: Amount */}
                <div
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium ${
                    item.type === "income"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span>
                    {item.type === "income" ? "+" : "-"} $
                    {addThousandsSeparator(item.amount)}
                  </span>
                  {item.type === "income" ? (
                    <TrendingUp size={15} />
                  ) : (
                    <TrendingDown size={15} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No results found</p>
        )}
      </div>
    </Dashboard>
  );
};

export default Filter;
