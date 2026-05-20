"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import UserDetailsModal from "./UserDetailsModal";
import AdminDetailsModal from "./AdminDetailsModal"; 
import AdminFormModal, { AdminFormData } from "./AdminFormModal";
import { Search, Calendar, Eye, LockKeyhole, RotateCcw, ArrowUpDown, Plus } from "lucide-react";
import DatePicker from "react-datepicker";
import { userService } from "@/services/userService";
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

interface UserData {
  id: string;
  name: string;
  joinDate: string;
  role: "Seller" | "Bidder";
  status: "Active" | "Blocked";
  hasUnlockRequest: boolean;
  enabled: boolean;
}

interface AdminData {
  id: string;
  displayName: string;
  creationDate: string;
  status: "Active" | "Inactive";
  _raw?: any;
}

export default function AdminPermissionsPage() {
  const [activeTab, setActiveTab] = useState<"users" | "admins">("users");

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [roleFilters, setRoleFilters] = useState<string[]>([]);
  const [sortDesc, setSortDesc] = useState(true);
  const [isUnlockSorted, setIsUnlockSorted] = useState(false);

  const [users, setUsers] = useState<UserData[]>([]);
  const [admins, setAdmins] = useState<AdminData[]>([]);

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [selectedAdmin, setSelectedAdmin] = useState<AdminData | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminFormModalOpen, setIsAdminFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [adminToEdit, setAdminToEdit] = useState<AdminFormData | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers(0, 1000);
      const allUsers = res.data.content || [];

      const mappedUsers: UserData[] = [];
      const mappedAdmins: AdminData[] = [];

      await Promise.all(
        allUsers.map(async (u: any) => {
          const fallbackDate = u.createdAt 
            ? new Date(u.createdAt).toLocaleDateString('en-GB') 
            : new Date().toLocaleDateString('en-GB');

          const userRole = u.role ? u.role.toUpperCase() : "";

          if (userRole === "ADMIN") {
            mappedAdmins.push({
              id: u.id,
              displayName: u.fullName,
              creationDate: fallbackDate,
              status: u.enabled ? "Active" : "Inactive",
              _raw: u
            });
          } else {
            let isLockedByLog = false;
            let userHasUnlockRequest = false; 
            
            try {
              const logRes = await userService.getAccountLogs(u.id, 0, 50);
              const logs = logRes.data?.content || [];
              
              if (logs.length > 0) {
                if (logs[0].action === "LOCK") {
                  isLockedByLog = true;
                }
                
                const hasRequestInLog = logs.some((log: any) => {
                  const actionStr = String(log.action || "").toUpperCase();
                  const reasonStr = String(log.reason || "").toUpperCase();
                  return actionStr === "REQUEST_UNLOCK" || reasonStr.includes("REQUEST_UNLOCK");
                });

                if (hasRequestInLog) {
                  userHasUnlockRequest = true;
                }
              }
            } catch (err) {
              console.error("Failed to check logs for user: " + u.id, err);
            }

            const isUserBlocked = u.enabled === false || isLockedByLog;

            if (isUserBlocked) {
              userHasUnlockRequest = true; 
            }

            mappedUsers.push({
              id: u.id,
              name: u.fullName,
              joinDate: fallbackDate,
              role: userRole === "SELLER" ? "Seller" : "Bidder", 
              status: isUserBlocked ? "Blocked" : "Active",
              hasUnlockRequest: userHasUnlockRequest, 
              enabled: u.enabled 
            });
          }
        })
      );

      setUsers(mappedUsers);
      setAdmins(mappedAdmins);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenUserModal = (user: UserData) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleOpenAdminModal = (admin: AdminData) => {
    setSelectedAdmin(admin);
    setIsAdminModalOpen(true);
  };

  const handleReset = () => {
    setSearch("");
    setStartDate(null);
    setEndDate(null);
    setStatusFilters([]);
    setRoleFilters([]);
    setIsUnlockSorted(false);
  };

  const parseDate = (dStr: string) => {
    const [day, month, year] = dStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const handleCreateAdmin = () => {
    setFormMode("create");
    setAdminToEdit(null);
    setIsAdminFormModalOpen(true);
  };

  const handleEditAdmin = () => {
    if (!selectedAdmin || !selectedAdmin._raw) return;
    
    const u = selectedAdmin._raw;
    
    const editData: AdminFormData = {
      id: Number(u.id) || 0,
      fullname: u.fullName || "",
      displayName: u.fullName || "",
      status: u.enabled ? "Active" : "Inactive",
      email: u.email || "", 
      phone: u.phone || "", 
      street: u.street || "",
      city: u.province || "",
      ward: u.ward || "",
      password: "", 
      permissions: u.role?.name ? [u.role.name] : [], 
    };
    
    setFormMode("edit");
    setAdminToEdit(editData);
    setIsAdminModalOpen(false); 
    setIsAdminFormModalOpen(true); 
  };

  const filteredUsers = useMemo(() => {
    let filtered = users.filter(u => {
      const matchSearch = search.length >= 2 ? u.name.toLowerCase().includes(search.toLowerCase()) : true;
      const matchStatus = statusFilters.length === 0 || statusFilters.includes(u.status);
      const matchRole = roleFilters.length === 0 || roleFilters.includes(u.role);
      
      let matchDate = true;
      const uDate = parseDate(u.joinDate);
      if (startDate && endDate) matchDate = uDate >= startDate && uDate <= endDate;
      else if (startDate) matchDate = uDate >= startDate;
      else if (endDate) matchDate = uDate <= endDate;

      return matchSearch && matchStatus && matchRole && matchDate;
    });

    if (isUnlockSorted) {
      return [...filtered].sort((a, b) => Number(b.hasUnlockRequest) - Number(a.hasUnlockRequest));
    }

    return filtered.sort((a, b) => sortDesc ? parseDate(b.joinDate).getTime() - parseDate(a.joinDate).getTime() : parseDate(a.joinDate).getTime() - parseDate(b.joinDate).getTime());
  }, [users, search, startDate, endDate, statusFilters, roleFilters, sortDesc, isUnlockSorted]);

  const filteredAdmins = useMemo(() => {
    let filtered = admins.filter(a => {
      const matchSearch = search.length >= 2 ? a.displayName.toLowerCase().includes(search.toLowerCase()) : true;
      const matchStatus = statusFilters.length === 0 || statusFilters.includes(a.status);
      
      let matchDate = true;
      const aDate = parseDate(a.creationDate);
      if (startDate && endDate) matchDate = aDate >= startDate && aDate <= endDate;
      else if (startDate) matchDate = aDate >= startDate;
      else if (endDate) matchDate = aDate <= endDate;

      return matchSearch && matchStatus && matchDate;
    });
    return filtered.sort((a, b) => sortDesc ? parseDate(b.creationDate).getTime() - parseDate(a.creationDate).getTime() : parseDate(a.creationDate).getTime() - parseDate(b.creationDate).getTime());
  }, [admins, search, startDate, endDate, statusFilters, sortDesc]);

  const currentData = activeTab === "users" ? filteredUsers : filteredAdmins;

  return (
    <div className={`${jost.className} min-h-screen bg-white flex flex-col text-gray-900`}>
      <Header />
      <main className="max-w-screen-xl mx-auto w-full py-10 flex-1 px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <aside className="md:col-span-3"><Sidebar /></aside>
          
          <div className="md:col-span-9 space-y-8">
            <div className="flex border-b border-gray-200 gap-8">
              {["users", "admins"].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => { setActiveTab(tab as any); handleReset(); }}
                  suppressHydrationWarning={true}
                  className={`pb-3 text-lg font-bold transition-colors border-b-2 capitalize ${activeTab === tab ? "text-[#ce2029] border-[#ce2029]" : "text-gray-400 hover:text-gray-800 border-transparent"}`}
                >
                  List of {tab}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between min-h-[44px]">
                <div className="flex items-center gap-2">
                  <h3 className="text-[#CE2029] font-bold text-xl">Search</h3>
                  <button onClick={handleReset} suppressHydrationWarning={true} className="p-1 hover:rotate-180 transition-transform duration-500 text-gray-400 hover:text-[#CE2029]"><RotateCcw size={18} strokeWidth={2.5}/></button>
                </div>

                {activeTab === "admins" && (
                  <button 
                    type="button"
                    onClick={handleCreateAdmin}
                    suppressHydrationWarning={true}
                    className="relative z-[1] bg-blue-600 !opacity-100 visible text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95 border-none outline-none"
                  >
                    <Plus size={18} strokeWidth={3} className="text-white" /> 
                    <span className="text-white">Create New Account</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-grow min-w-[280px] relative">
                  <input type="text" placeholder="Search by keyword..." value={search} onChange={(e) => setSearch(e.target.value)}
                    suppressHydrationWarning={true}
                    className="w-full h-12 bg-white border border-gray-200 rounded-xl px-6 outline-none focus:border-[#CE2029] transition-all" />
                </div>
                <div className="w-44 space-y-1 custom-datepicker">
                  <label className="text-xs font-bold text-gray-400 ml-2">From Date:</label>
                  <div className="relative" suppressHydrationWarning={true}>
                    <DatePicker selected={startDate} onChange={(d: Date | null) => setStartDate(d)} maxDate={endDate || undefined} placeholderText="dd/mm/yyyy" dateFormat="dd/MM/yyyy" className="w-full h-10 border border-gray-200 rounded-full px-4 outline-none text-sm" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                  </div>
                </div>
                <div className="w-44 space-y-1 custom-datepicker">
                  <label className="text-xs font-bold text-gray-400 ml-2">To Date:</label>
                  <div className="relative" suppressHydrationWarning={true}>
                    <DatePicker selected={endDate} onChange={(d: Date | null) => setEndDate(d)} minDate={startDate || undefined} placeholderText="dd/mm/yyyy" dateFormat="dd/MM/yyyy" className="w-full h-10 border border-gray-200 rounded-full px-4 outline-none text-sm" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-4">
                  <span className="text-[#CE2029] font-bold text-sm">Status</span>
                  <div className="flex gap-4">
                    {(activeTab === "users" ? ["Active", "Blocked"] : ["Active", "Inactive"]).map(s => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" checked={statusFilters.includes(s)} onChange={() => setStatusFilters(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} className="w-4 h-4 accent-[#CE2029]" />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-black">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {activeTab === "users" && (
                  <div className="flex items-center gap-4">
                    <span className="text-[#CE2029] font-bold text-sm">Role</span>
                    <div className="flex gap-4">
                      {["Seller", "Bidder"].map(r => (
                        <label key={r} className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" checked={roleFilters.includes(r)} onChange={() => setRoleFilters(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])} className="w-4 h-4 accent-[#CE2029]" />
                          <span className="text-sm font-medium text-gray-600 group-hover:text-black">{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-center border-collapse table-fixed">
                <thead>
                  <tr className="border-b-2 border-black bg-white">
                    <th className="py-4 font-bold w-16">No</th>
                    <th className="py-4 font-bold pl-8 w-48">{activeTab === "users" ? "Sender" : "Display name"}</th>
                    <th className="py-4 font-bold cursor-pointer hover:text-[#CE2029] w-36" onClick={() => { setIsUnlockSorted(false); setSortDesc(!sortDesc); }}>
                      <div className="flex items-center justify-center gap-1">{activeTab === "users" ? "Join Date" : "Creation date"} <ArrowUpDown size={14} /></div>
                    </th>
                    {activeTab === "users" && <th className="py-4 font-bold w-24">Role</th>}
                    <th className="py-4 font-bold w-28">Status</th>
                    {activeTab === "users" && (
                      <th className="py-4 font-bold cursor-pointer hover:text-[#CE2029] w-44" onClick={() => setIsUnlockSorted(!isUnlockSorted)}>
                        <div className="flex items-center justify-center gap-1 whitespace-nowrap">Unlock Request <ArrowUpDown size={14} /></div>
                      </th>
                    )}
                    <th className="py-4 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? currentData.map((item: any, index: number) => (
                    <tr key={item.id} className={`${index % 2 === 0 ? "bg-[#EBF2F7]" : "bg-white"} group hover:!bg-[#d1e3f0] transition-colors relative cursor-default`}>
                      <td className="py-4">{index + 1}</td>
                      <td className="py-4 pl-8 truncate">{activeTab === "users" ? item.name : item.displayName}</td>
                      <td className="py-4">{activeTab === "users" ? item.joinDate : item.creationDate}</td>
                      {activeTab === "users" && <td className="py-4">{item.role}</td>}
                      <td className={`py-4 font-bold ${item.status === "Active" ? "text-blue-600" : "text-[#CE2029]"}`}>{item.status}</td>
                      
                      {activeTab === "users" && (
                        <td className="py-4">
                          {item.hasUnlockRequest ? (
                            <div className="flex justify-center animate-pulse">
                              <LockKeyhole size={18} className="text-[#CE2029]" />
                            </div>
                          ) : "-"}
                        </td>
                      )}

                      <td className="py-4">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                           <Eye 
                            size={18} 
                            className="text-gray-600 cursor-pointer hover:text-black" 
                            onClick={() => {
                              if (activeTab === "users") {
                                handleOpenUserModal(item);
                              } else {
                                handleOpenAdminModal(item);
                              }
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={activeTab === "users" ? 7 : 5} className="py-12 text-gray-400 font-bold bg-white text-center">
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <UserDetailsModal
          isOpen={isUserModalOpen}
          onClose={() => {
            setIsUserModalOpen(false);
            fetchUsers(); 
          }}
          user={selectedUser as any}
        />

        <AdminDetailsModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          admin={selectedAdmin as any}
          onEditClick={handleEditAdmin}
        />

        <AdminFormModal
          isOpen={isAdminFormModalOpen}
          mode={formMode}
          initialData={adminToEdit}
          onClose={() => setIsAdminFormModalOpen(false)}
          onSubmit={(data) => {
            setIsAdminFormModalOpen(false);
          }}
        />

      </main>
      <Footer />
      <style jsx global>{`
        .custom-datepicker .react-datepicker-wrapper { width: 100%; }
        .react-datepicker { font-family: inherit; border-radius: 12px; border: 1px solid #eee; }
        .react-datepicker__header { background-color: white; border-bottom: 1px solid #eee; }
        .react-datepicker__day--selected { background-color: #CE2029 !important; border-radius: 8px; }
        .react-datepicker__day--today { font-weight: normal !important; }
      `}</style>
    </div>
  );
}