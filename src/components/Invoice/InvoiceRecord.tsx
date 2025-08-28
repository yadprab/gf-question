import { useState } from "react";
import { useInvoiceStore } from "../../store/invoiceSlice";
import { ChevronDown, MessageSquare } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: Date;
  status: "pending" | "paid" | "overdue" | "processing" | "cancelled";
  daysOverdue: number;
  comments: Comment[];
  lastUpdated: Date;
  updatedBy: string;
}
interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

const InvoiceRow: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  const { updateInvoiceStatus, setSelectedInvoice } = useInvoiceStore();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleStatusChange = (newStatus: Invoice["status"]) => {
    updateInvoiceStatus(invoice.id, newStatus);
    setShowStatusDropdown(false);
  };

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900">
            {invoice.invoiceNumber}
          </div>
          <div className="text-sm text-gray-500">{invoice.clientName}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {formatCurrency(invoice.amount)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {formatDate(invoice.dueDate)}
        </div>
        {invoice.daysOverdue > 0 && (
          <div className="text-sm text-red-600 font-medium">
            {invoice.daysOverdue} days overdue
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="flex items-center space-x-1 hover:bg-gray-100 rounded p-1"
          >
            <StatusBadge status={invoice.status} />
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showStatusDropdown && (
            <div className="absolute z-10 mt-1 w-32 bg-white rounded-md shadow-lg border">
              {["pending", "processing", "paid", "overdue", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() =>
                      handleStatusChange(status as Invoice["status"])
                    }
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelectedInvoice(invoice)}
            className="flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            <span className="text-sm">{invoice.comments.length}</span>
          </button>
          <div className="text-xs text-gray-500">
            Updated by {invoice.updatedBy}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default InvoiceRow;
