import React, { useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Clock,
  IndianRupeeIcon,
  AlertCircle,
  Check,
  X,
  UserRoundPlusIcon,
} from "lucide-react";
import { useInvoiceStore } from "../store/invoiceSlice";
import CommentModal from "./Invoice/CommentModal";
import InvoiceRow from "./Invoice/InvoiceRecord";
import { CircularProgress, MenuItem, Select } from "@mui/material";

const InvoiceManagement: React.FC = () => {
  const {
    filteredInvoices,
    searchTerm,
    statusFilter,
    sortBy,
    sortOrder,
    loading,
    setLoading,
    setSearchTerm,
    setStatusFilter,
    setSortBy,
    setSortOrder,
  } = useInvoiceStore();

  useEffect(() => {
    useInvoiceStore.getState().filterAndSort();
    setLoading(false);
  }, []);



  const handleSort = (field: "dueDate" | "amount" | "daysOverdue") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const totalAmount = filteredInvoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );
  const overdueCount = filteredInvoices.filter(
    (invoice) => invoice.status === "overdue"
  ).length;
  const pendingCount = filteredInvoices.filter(
    (invoice) => invoice.status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 !w-[90vw] ">
      {/* Header */}
      <div className="mb-8 flex flex-row gap-4 items-center justify-between ">
        <div>
        <img 
          src="https://assets.kula.ai/images/career/8xd3hf1fyxe4a2lhbxmsln4du8dj"
          alt="GrowFin"
        />
        </div>
        <div>
        <h1 className="!text-[25px] font-bold text-gray-900">
          Invoice Management
        </h1>
        <p className="mt-2 text-gray-600">
          Track and manage your company's invoices efficiently
        </p>
        </div>
        <div className="flex flex-row gap-2 items-center text-[16px] font-semibold">
          <UserRoundPlusIcon/>
         <p>Dinesh Sellappan</p> 
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <IndianRupeeIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{totalAmount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Check className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Invoices
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInvoices.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search invoices or clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[40px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow ">
        <table className="w-[100%] divide-y divide-gray-200 ">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Amount
                  {sortBy === "amount" && (
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transform ${
                        sortOrder === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort("dueDate")}
              >
                <div className="flex items-center">
                  Due Date
                  {sortBy === "dueDate" && (
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transform ${
                        sortOrder === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comments & Updates
              </th>
            </tr>
          </thead>
          {!loading && (
            <tbody className="bg-white divide-y divide-gray-200 max-h-[300px] overflow-y-auto">
              {filteredInvoices.map((invoice) => (
                <InvoiceRow key={invoice.id} invoice={invoice} />
              ))}
            </tbody>
          )}
        </table>

        {filteredInvoices.length === 0 && !loading && (
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No invoices found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
      {loading && <CircularProgress />}

      <CommentModal />
    </div>
  );
};

export default InvoiceManagement;
