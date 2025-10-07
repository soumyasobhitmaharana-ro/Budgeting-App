import { Trash2, TrendingUp, TrendingDown } from "lucide-react";

const addThousandsSeparator = (num) => {
  if (!num) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const TransactionInfoCard = ({
  icon,
  title,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {
  const getAmountStyles = () =>
    type === "income"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="group relative flex items-center justify-between p-3 rounded-lg hover:bg-gray-100/60 transition">
      {/* Left: Icon and title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-lg">
          {icon || "💰"}
        </div>
        <div className="flex flex-col">
          <h6 className="text-sm font-semibold text-gray-900">
            {title || "Untitled"}
          </h6>
          {date && <p className="text-xs text-gray-400 mt-1">{date}</p>}
        </div>
      </div>

      {/* Right: Amount and delete button */}
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium ${getAmountStyles()}`}
        >
          <span>
            {type === "income" ? "+" : "-"} ${addThousandsSeparator(amount)}
          </span>
          {type === "income" ? (
            <TrendingUp size={15} />
          ) : (
            <TrendingDown size={15} />
          )}
        </div>

        {!hideDeleteBtn && (
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition duration-300 transform hover:scale-110"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionInfoCard;
