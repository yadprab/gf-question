import { create } from "zustand";
import { debounce } from "../utils/helpers/newUtils";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

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
interface InvoiceStore {
  invoices: Invoice[];
  filteredInvoices: Invoice[];
  searchTerm: string;
  statusFilter: string;
  sortBy: "dueDate" | "amount" | "daysOverdue";
  sortOrder: "asc" | "desc";
  selectedInvoice: Invoice | null;
  currentUser: string;
  loading: boolean;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setSortBy: (field: "dueDate" | "amount" | "daysOverdue") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  updateInvoiceStatus: (id: string, status: Invoice["status"]) => void;
  addComment: (invoiceId: string, text: string) => void;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  filterAndSort: () => void;
  setLoading: (loading: boolean) => void;
  clearStore: () => void;
}

const initialState: any = {
  currentUser: "Dinesh Sellappan",
  searchTerm: "",
  statusFilter: "all",
  sortBy: "dueDate",
  sortOrder: "asc",
  selectedInvoice: null,
  invoices: [
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      clientName: "Google Inc",
      amount: 25000,
      dueDate: new Date("2024-08-20"),
      status: "overdue",
      daysOverdue: 8,
      comments: [
        {
          id: "1",
          userId: "1",
          userName: "Alice Smith",
          text: "Client contacted, payment expected by Friday",
          timestamp: new Date("2024-08-25"),
        },
      ],
      lastUpdated: new Date("2024-08-25"),
      updatedBy: "Alice Smith",
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      clientName: "Amazon Inc",
      amount: 15750,
      dueDate: new Date("2024-09-05"),
      status: "pending",
      daysOverdue: 0,
      comments: [],
      lastUpdated: new Date("2024-08-28"),
      updatedBy: "System",
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      clientName: "Global Solutions Ltd",
      amount: 42300,
      dueDate: new Date("2024-08-15"),
      status: "processing",
      daysOverdue: 13,
      comments: [
        {
          id: "2",
          userId: "2",
          userName: "Bob Johnson",
          text: "Payment in progress, bank transfer initiated",
          timestamp: new Date("2024-08-27"),
        },
        {
          id: "3",
          userId: "1",
          userName: "Alice Smith",
          text: "Confirmed with client finance team",
          timestamp: new Date("2024-08-26"),
        },
      ],
      lastUpdated: new Date("2024-08-27"),
      updatedBy: "Bob Johnson",
    },
    {
      id: "4",
      invoiceNumber: "INV-2024-004",
      clientName: "Microsoft Inc",
      amount: 8900,
      dueDate: new Date("2024-09-10"),
      status: "paid",
      daysOverdue: 0,
      comments: [
        {
          id: "4",
          userId: "3",
          userName: "Carol Davis",
          text: "Payment received via wire transfer",
          timestamp: new Date("2024-08-28"),
        },
      ],
      lastUpdated: new Date("2024-08-28"),
      updatedBy: "Carol Davis",
    },
    {
      id: "5",
      invoiceNumber: "INV-2024-005",
      clientName: "Enterprise Co",
      amount: 67500,
      dueDate: new Date("2024-09-01"),
      status: "pending",
      daysOverdue: 0,
      comments: [],
      lastUpdated: new Date("2024-08-28"),
      updatedBy: "System",
    },
  ],
  filteredInvoices: [],
  loading: false,
};

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  ...initialState,
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().setLoading(true);
    const debouncedFilterAndSort = debounce(get().filterAndSort, 1000);
    debouncedFilterAndSort();
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status });
    get().setLoading(true);
    get().filterAndSort();
  },

  setSortBy: (field) => {
    set({ sortBy: field });
    get().filterAndSort();
  },

  setSortOrder: (order) => {
    set({ sortOrder: order });
    get().filterAndSort();
  },

  updateInvoiceStatus: (id, status) => {
    const { invoices, currentUser } = get();
    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === id
        ? {
            ...invoice,
            status,
            lastUpdated: new Date(),
            updatedBy: currentUser,
            daysOverdue: status === "paid" ? 0 : invoice.daysOverdue,
          }
        : invoice
    );
    set({ invoices: updatedInvoices });
    get().filterAndSort();

    // Simulate real-time update notification
    setTimeout(() => {
      const updatedInvoice = updatedInvoices.find((inv) => inv.id === id);
      if (updatedInvoice) {
        console.log(
          `Real-time update: Invoice ${updatedInvoice.invoiceNumber} status changed to ${status} by ${currentUser}`
        );
      }
    }, 500);
  },

  addComment: (invoiceId, text) => {
    const { invoices, currentUser } = get();
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: "1",
      userName: currentUser,
      text,
      timestamp: new Date(),
    };

    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === invoiceId
        ? {
            ...invoice,
            comments: [...invoice.comments, newComment],
            lastUpdated: new Date(),
            updatedBy: currentUser,
          }
        : invoice
    );

    set({ invoices: updatedInvoices });
    get().filterAndSort();

    // Update selected invoice if it's the one being commented on
    const { selectedInvoice } = get();
    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      const updatedSelected = updatedInvoices.find(
        (inv) => inv.id === invoiceId
      );
      set({ selectedInvoice: updatedSelected || null });
    }
  },

  setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),

  filterAndSort: () => {
    const { invoices, searchTerm, statusFilter, sortBy, sortOrder } = get();

    let filtered = invoices.filter((invoice) => {
      const matchesSearch =
        searchTerm === "" ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aVal: any = a[sortBy];
      let bVal: any = b[sortBy];

      if (sortBy === "dueDate") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    set({ filteredInvoices: filtered });
    get().setLoading(false);
  },
  setLoading: (loading) => set({ loading: loading }),
  clearStore: () => set({ ...initialState }),
}));
