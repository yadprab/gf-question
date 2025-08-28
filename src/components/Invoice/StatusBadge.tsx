import { Clock, AlertCircle, Check, X } from "lucide-react";

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

const StatusBadge: React.FC<{ status: Invoice["status"] }> = ({ status }) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    paid: { color: "bg-green-100 text-green-800", icon: Check },
    overdue: { color: "bg-red-100 text-red-800", icon: AlertCircle },
    processing: { color: "bg-blue-100 text-blue-800", icon: Clock },
    cancelled: { color: "bg-gray-100 text-gray-800", icon: X },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
