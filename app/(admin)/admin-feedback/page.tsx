"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Search, Calendar, Eye, Pencil, ArrowUpDown, RotateCcw } from "lucide-react";
import DatePicker from "react-datepicker";
import { FeedbackModal } from "./FeedbackModal";
import { MessageModal } from "./MessageModal";
import { feedbackService } from "@/services/feedbackService";
import { contactService } from "@/services/contactService";
import type { FeedbackResponse, FeedbackStatus } from "@/types/feedback";
import type { ContactMessageResponse, ContactStatus } from "@/types/contact";
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

type StatusType = "Pending" | "Resolved" | "Reject";
type ModalType = "feedback" | "message" | null;

interface TableItem {
  id: string;
  sender: string;
  date: string;
  createdAt: string;
  status: StatusType;
  fullName: string;
  role: string;
  email: string;
  phone: string;
  address?: string;
  content: string;
  response?: string;
}

const statusToDisplay = (status?: string): StatusType => {
  if (status === "RESOLVED") return "Resolved";
  if (status === "REJECTED") return "Reject";
  return "Pending";
};

const formatDate = (value: string) => new Date(value).toLocaleDateString("en-GB");

const buildStatusFilter = (statuses: StatusType[]): FeedbackStatus | ContactStatus | undefined => {
  if (statuses.length !== 1) return undefined;
  if (statuses[0] === "Pending") return "PENDING";
  if (statuses[0] === "Resolved") return "RESOLVED";
  return "REJECTED";
};

const TableSection = ({
  title,
  data,
  isLoading,
  search,
  setSearch,
  start,
  setStart,
  end,
  setEnd,
  statuses,
  setStatuses,
  sortDesc,
  setSortDesc,
  options,
  onAction,
}: any) => {
  const getStatusColor = (status: string) => {
    const normalized = status?.toString().toLowerCase();
    if (normalized === "pending") return "text-[#E67E22]";
    if (normalized === "reject" || normalized === "rejected") return "text-[#FF0000]";
    return "text-[#0000FF]";
  };

  const handleStatusChange = (status: string) => {
    setStatuses((prev: string[]) => (prev.includes(status) ? prev.filter((item) => item !== status) : [...prev, status]));
  };

  const handleReset = () => {
    setSearch("");
    setStart(null);
    setEnd(null);
    setStatuses([]);
  };

  return (
    <div className={`${jost.className} space-y-6 select-none`}>
      <h2 className="text-[#CE2029] font-bold text-2xl">{title}</h2>

      <div className="flex flex-wrap items-end gap-4 mb-8">
        <div className="flex-grow min-w-[280px]">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search by name sender"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-white border border-gray-200 rounded-xl px-12 outline-none font-medium text-gray-700 focus:border-[#CE2029] transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#CE2029]" size={18} />
          </div>
        </div>

        <div className="w-full md:w-48 space-y-1.5 custom-datepicker">
          <label className="text-xs font-bold text-gray-400 ml-2">From Date:</label>
          <div className="relative">
            <DatePicker
              selected={start}
              onChange={(d: Date | null) => setStart(d)}
              maxDate={end || undefined}
              placeholderText="dd/mm/yyyy"
              dateFormat="dd/MM/yyyy"
              className="w-full h-12 bg-white border border-gray-200 rounded-xl px-5 outline-none font-medium text-gray-600 focus:border-[#CE2029] transition-all"
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
          </div>
        </div>

        <div className="w-full md:w-48 space-y-1.5 custom-datepicker">
          <label className="text-xs font-bold text-gray-400 ml-2">To Date:</label>
          <div className="relative">
            <DatePicker
              selected={end}
              onChange={(d: Date | null) => setEnd(d)}
              minDate={start || undefined}
              placeholderText="dd/mm/yyyy"
              dateFormat="dd/MM/yyyy"
              className="w-full h-12 bg-white border border-gray-200 rounded-xl px-5 outline-none font-medium text-gray-600 focus:border-[#CE2029] transition-all"
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
          </div>
        </div>

        <button
          onClick={handleReset}
          className="h-12 w-12 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:text-[#CE2029] hover:border-[#CE2029] transition-all duration-500 group"
          title="Reset filters"
        >
          <RotateCcw size={20} strokeWidth={2.5} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      <div className="flex items-center gap-8 py-4 px-6 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl w-full md:w-max">
        <span className="text-[#CE2029] font-bold text-sm">Status</span>
        <div className="flex gap-6 flex-wrap">
          {options.map((opt: string) => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={statuses.includes(opt)}
                  onChange={() => handleStatusChange(opt)}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-[#CE2029] checked:border-[#CE2029] transition-all cursor-pointer"
                />
                <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 mt-6 bg-white">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-4 font-bold w-16 text-black">No</th>
              <th className="py-4 font-bold text-black pl-8">Sender</th>
              <th className="py-4 font-bold cursor-pointer hover:text-[#CE2029] text-black" onClick={() => setSortDesc(!sortDesc)}>
                <div className="flex items-center justify-center gap-1">Date <ArrowUpDown size={14} /></div>
              </th>
              <th className="py-4 font-bold text-black">Status</th>
              <th className="py-4 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-gray-400 font-bold bg-white">
                  Loading...
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item: TableItem, index: number) => (
                <tr key={item.id} className={`${index % 2 === 0 ? "bg-[#EBF2F7]" : "bg-white"} group hover:!bg-[#d1e3f0] transition-colors relative`}>
                  <td className="py-4">{index + 1}</td>
                  <td className="py-4 pl-8">{item.sender}</td>
                  <td className="py-4">{item.date}</td>
                  <td className={`py-4 ${getStatusColor(item.status)}`}>{item.status}</td>
                  <td className="py-4">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
                      {item.status === "Pending" ? (
                        <Pencil size={18} className="text-gray-600 cursor-pointer hover:text-[#CE2029]" onClick={() => onAction(item, "edit")} />
                      ) : (
                        <Eye size={18} className="text-gray-600 cursor-pointer hover:text-blue-600" onClick={() => onAction(item, "view")} />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-gray-400 font-bold bg-white">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function AdminFeedbackPage() {
  const [fbSearch, setFbSearch] = useState("");
  const [fbStart, setFbStart] = useState<Date | null>(null);
  const [fbEnd, setFbEnd] = useState<Date | null>(null);
  const [fbStatus, setFbStatus] = useState<StatusType[]>([]);
  const [fbSortDesc, setFbSortDesc] = useState(true);

  const [ctSearch, setCtSearch] = useState("");
  const [ctStart, setCtStart] = useState<Date | null>(null);
  const [ctEnd, setCtEnd] = useState<Date | null>(null);
  const [ctStatus, setCtStatus] = useState<StatusType[]>([]);
  const [ctSortDesc, setCtSortDesc] = useState(true);

  const [feedbackItems, setFeedbackItems] = useState<TableItem[]>([]);
  const [contactItems, setContactItems] = useState<TableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [feedbackStatusFilter, contactStatusFilter] = [buildStatusFilter(fbStatus), buildStatusFilter(ctStatus)];
      const [feedbackResponse, contactResponse] = await Promise.all([
        feedbackService.getAll(feedbackStatusFilter, 0, 100),
        contactService.getAll(contactStatusFilter, 0, 100),
      ]);

      setFeedbackItems(
        (feedbackResponse.data?.content || []).map((item: FeedbackResponse) => ({
          id: item.id,
          sender: item.fullName,
          date: formatDate(item.createdAt),
          createdAt: item.createdAt,
          status: statusToDisplay(item.status),
          fullName: item.fullName,
          role: item.role,
          email: item.email,
          phone: item.phone,
          content: item.content,
          response: item.response,
        }))
      );

      setContactItems(
        (contactResponse.data?.content || []).map((item: ContactMessageResponse) => ({
          id: item.id,
          sender: item.fullName,
          date: formatDate(item.createdAt),
          createdAt: item.createdAt,
          status: statusToDisplay(item.status),
          fullName: item.fullName,
          role: "Guest",
          email: item.email,
          phone: item.phone,
          address: item.address,
          content: item.message,
          response: item.response,
        }))
      );
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to load feedback and contact messages.");
    } finally {
      setIsLoading(false);
    }
  }, [fbStatus, ctStatus]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filterItems = (
    data: TableItem[],
    search: string,
    start: Date | null,
    end: Date | null,
    statuses: StatusType[],
    isDesc: boolean
  ) => {
    const filtered = data.filter((item) => {
      const matchSearch =
        search.length === 0 ||
        item.sender.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statuses.length === 0 || statuses.includes(item.status);
      let matchDate = true;
      const itemDate = new Date(item.createdAt);
      if (start && end) matchDate = itemDate >= start && itemDate <= end;
      else if (start) matchDate = itemDate >= start;
      else if (end) matchDate = itemDate <= end;
      return matchSearch && matchStatus && matchDate;
    });

    return filtered.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return isDesc ? timeB - timeA : timeA - timeB;
    });
  };

  const filteredFeedbacks = useMemo(
    () => filterItems(feedbackItems, fbSearch, fbStart, fbEnd, fbStatus, fbSortDesc),
    [feedbackItems, fbSearch, fbStart, fbEnd, fbStatus, fbSortDesc]
  );

  const filteredContacts = useMemo(
    () => filterItems(contactItems, ctSearch, ctStart, ctEnd, ctStatus, ctSortDesc),
    [contactItems, ctSearch, ctStart, ctEnd, ctStatus, ctSortDesc]
  );

  const handleAction = (item: TableItem, type: "feedback" | "message", mode: "view" | "edit") => {
    setSelectedItem(item);
    setModalType(type);
    setIsReadOnly(mode === "view");
  };

  const handleResolveSuccess = () => {
    setModalType(null);
    void fetchData();
  };

  const handleRejectSuccess = () => {
    setModalType(null);
    void fetchData();
  };

  return (
    <div className={`${jost.className} min-h-screen bg-white flex flex-col text-gray-900`}>
      <Header />
      <main className="max-w-screen-xl mx-auto w-full py-10 flex-1 px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <aside className="md:col-span-3">
            <Sidebar />
          </aside>
          <div className="md:col-span-9 space-y-8">
            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
                {errorMessage}
              </div>
            )}

            <TableSection
              title="Feedback"
              data={filteredFeedbacks}
              isLoading={isLoading}
              search={fbSearch}
              setSearch={setFbSearch}
              start={fbStart}
              setStart={setFbStart}
              end={fbEnd}
              setEnd={setFbEnd}
              statuses={fbStatus}
              setStatuses={setFbStatus}
              sortDesc={fbSortDesc}
              setSortDesc={setFbSortDesc}
              options={["Pending", "Resolved", "Reject"]}
              onAction={(item: TableItem, mode: "view" | "edit") => handleAction(item, "feedback", mode)}
            />

            <TableSection
              title="Contact Messages"
              data={filteredContacts}
              isLoading={isLoading}
              search={ctSearch}
              setSearch={setCtSearch}
              start={ctStart}
              setStart={setCtStart}
              end={ctEnd}
              setEnd={setCtEnd}
              statuses={ctStatus}
              setStatuses={setCtStatus}
              sortDesc={ctSortDesc}
              setSortDesc={setCtSortDesc}
              options={["Pending", "Resolved", "Reject"]}
              onAction={(item: TableItem, mode: "view" | "edit") => handleAction(item, "message", mode)}
            />
          </div>
        </div>
      </main>
      <Footer />

      {modalType === "feedback" && selectedItem && (
        <FeedbackModal
          isOpen={true}
          onClose={() => setModalType(null)}
          feedbackId={selectedItem.id}
          onResolve={handleResolveSuccess}
          onReject={handleRejectSuccess}
          data={{
            fullName: selectedItem.fullName,
            role: selectedItem.role,
            email: selectedItem.email,
            phone: selectedItem.phone,
            feedback: selectedItem.content,
            response: selectedItem.response,
          }}
          isReadOnly={isReadOnly}
        />
      )}

      {modalType === "message" && selectedItem && (
        <MessageModal
          isOpen={true}
          onClose={() => setModalType(null)}
          messageId={selectedItem.id}
          onResolve={handleResolveSuccess}
          onReject={handleRejectSuccess}
          data={{
            fullName: selectedItem.fullName,
            role: selectedItem.role,
            email: selectedItem.email,
            phone: selectedItem.phone,
            address: selectedItem.address || "",
            message: selectedItem.content,
            response: selectedItem.response,
          }}
          isReadOnly={isReadOnly}
        />
      )}

      <style jsx global>{`
        .custom-datepicker .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker {
          font-family: inherit;
          border-radius: 12px;
          border: 1px solid #eee;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
        }
        .react-datepicker__header {
          background-color: white;
          border-bottom: 1px solid #eee;
        }
        .react-datepicker__day--selected {
          background-color: #CE2029 !important;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
