"use client";

import React, { useState, useEffect } from "react";
import { Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { EditCategoryModal } from "./EditCategoryModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { categoryService } from "@/services/categoryService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

interface Category {
  id: string;
  name: string;
  description: string;
  totalProducts: number;
}

export default function AdminCategoriesPage() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll(0, 100);
      const mapped = res.data.content.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        totalProducts: 0,
      }));
      setCategories(mapped);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = searchTerm.length >= 2 ? categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || cat.description.toLowerCase().includes(searchTerm.toLowerCase())) : categories;

  const sortedCategories = sortOrder
    ? [...filteredCategories].sort((a, b) => {
        const result = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? result : -result;
      })
    : filteredCategories;

  return (
    <div className={`${jost.className} min-h-screen bg-white flex flex-col`}>
      <Header />

      <main className="max-w-screen-xl mx-auto w-full py-10 flex-1 px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          <aside className="md:col-span-3 pr-0">
            <Sidebar />
          </aside>

          <div className="md:col-span-9 pl-0">
            <div className="space-y-6">
              <h2 className="text-[#d32f2f] font-[900] text-2xl">Categories</h2>

              <div className="flex justify-between items-center gap-4">
                <div className="flex-grow min-w-[280px]">
                  <div className="relative group">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by keyword..."
                      className="w-full h-12 bg-white border border-gray-200 rounded-xl px-12 outline-none font-medium text-gray-700 focus:border-[#CE2029] transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#CE2029]" size={18} />
                  </div>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition-colors shadow-md"
                >
                  <PlusCircle size={20} />
                  Create New Category
                </button>
              </div>

              <div className="overflow-hidden mt-4">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="border-b-2 border-gray-900">
                      <th className="py-4 px-4 text-center font-black text-lg w-16">No</th>
                      <th
                        className="py-4 px-4 text-left font-black text-lg w-48 cursor-pointer select-none"
                        onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                      >
                        Category{' '}
                        <span className="text-xs ml-1 font-bold">
                          {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '↑↓'}
                        </span>
                      </th>
                      <th className="py-4 px-4 text-center font-black text-lg">Description</th>
                      <th className="py-4 px-4 text-center font-black text-lg w-40">Total Products</th>
                      <th className="w-24"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCategories.map((cat, index) => (
                      <tr
                        key={cat.id}
                        className={`group border-b border-gray-200 ${hoveredRow === cat.id ? 'bg-blue-100' : ''} transition-colors duration-200`}
                        onMouseEnter={() => setHoveredRow(cat.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td className="py-6 px-4 text-center font-bold text-gray-800">
                          {index + 1}
                        </td>
                        <td className="py-6 px-4 text-left font-bold text-gray-800">
                          {cat.name}
                        </td>
                        <td className="py-6 px-8 text-center text-sm font-medium text-gray-700 leading-relaxed">
                          {cat.description}
                        </td>
                        <td className="py-6 px-4 text-center font-bold text-gray-800 border-l border-gray-300">
                          {cat.totalProducts}
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => {
                                setSelectedCategory(cat);
                                setIsEditModalOpen(true);
                              }}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Pencil size={22} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCategory(cat);
                                setIsDeleteModalOpen(true);
                              }}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={22} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredCategories.length === 0 && searchTerm.length >= 2 && (
                      <tr>
                        <td colSpan={5} className="font-[900] text-center py-6">
                          No results found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={() => fetchCategories()}
      />
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedCategory}
        onUpdate={() => fetchCategories()}
      />
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        category={selectedCategory}
        onDelete={() => fetchCategories()}
      />
    </div>
  );
}