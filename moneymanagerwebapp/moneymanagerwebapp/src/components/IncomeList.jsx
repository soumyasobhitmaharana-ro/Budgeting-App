import {
  Pencil,
  Trash2,
  Search,
  Download,
  Mail,
  LoaderCircle,
} from "lucide-react";
import TransactionInfo from "./TransactionInfo";
import { useState } from "react";

const IncomeList = ({
  transactions = [],
  searchTerm,
  setSearchTerm,
  onDelete,
  onDownload,
  onEmail,
}) => {
  const [emailLoading, setEmailLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleEmail = async () => {
    setEmailLoading(true);
    try {
      await onEmail();
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloadLoading(true);
    try {
      await onDownload();
    } finally {
      setDownloadLoading(false);
    }
  };

  // 🔍 Filter incomes by search term
  const filtered = transactions.filter(
    (t) =>
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Header with Email/Download buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <h5 className="text-lg font-semibold">Income Sources</h5>
        <div className="flex gap-2">
          {/* Email Button */}
          <button
            disabled={emailLoading}
            className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center gap-1"
            onClick={handleEmail}
          >
            {emailLoading ? (
              <>
                <LoaderCircle className="animate-spin" size={15} />
                Emailing..
              </>
            ) : (
              <>
                <Mail size={15} /> Email
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            disabled={downloadLoading}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"
            onClick={handleDownload}
          >
            {downloadLoading ? (
              <>
                <LoaderCircle className="animate-spin" size={15} />
                Downloading..
              </>
            ) : (
              <>
                <Download size={15} /> Download
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative w-full sm:w-1/2 mb-4">
        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search income..."
          className="pl-10 pr-4 py-2 border rounded-full w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid of transactions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length > 0 ? (
          filtered.map((income) => (
            <div
              key={income.id}
              className="group relative bg-white p-4 rounded-xl shadow hover:shadow-lg hover:bg-indigo-50 transition transform hover:-translate-y-1 cursor-pointer"
            >
              <TransactionInfo
                icon={income.icon}
                title={income.name}
                date={income.date || "N/A"}
                amount={income.amount}
                type="income"
                onDelete={() => onDelete(income.id)}
              />
            </div>
          ))
        ) : (
          <p className="col-span-full text-gray-500 text-center py-10">
            No income found
          </p>
        )}
      </div>
    </div>
  );
};

export default IncomeList;
