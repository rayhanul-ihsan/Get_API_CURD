"use client";

import { useFetchSale } from "@/hooks/useGetsale";
import { ISale } from "@/interface/interface";
import Link from "next/link";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoFilterSharp } from "react-icons/io5";
import ActionPage from "./ActionPage";
import DeleteModal from "./DeleteModal";
import { useParams } from "next/navigation";

const TableComp = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error, refetch } = useFetchSale();
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownToggle = (index: number) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
    setIsOpen(false);
  };

  const filteredData = data?.data
    .filter((item: ISale) =>
      item.invoice_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: ISale, b: ISale) => {
      const dateA = new Date(a.transaction_date ?? "");
      const dateB = new Date(b.transaction_date ?? "");

      if (sortOrder === "asc") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Unknown error"}</div>;
  }

  if (!data || !data.data) {
    return <div>No data found</div>;
  }

  return (
    <div className="relative overflow-x-auto m-20 shadow-md sm:rounded-lg">
      <div className="flex justify-between items-center mb-4 px-4 md:px-8">
        <div>
          <button
            id="dropdownActionButton"
            onClick={toggleDropdown}
            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button"
          >
            Action
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {isOpen && (
            <div
              id="dropdownAction"
              className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
            >
              <ul
                className="py-1 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownActionButton"
              >
                <li>
                  <button
                    onClick={() => handleSort("asc")}
                    className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Terlama
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSort("desc")}
                    className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Terbaru
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for invoice"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button className="text-black bg-transparent border border-black px-6 py-3 rounded-md">
            <IoFilterSharp />
          </button>
          <button className="px-6 py-3 text-sm font-bold bg-blue-400 hover:bg-blue-600 rounded-lg">
            <Link href="/add-new">Add New</Link>
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              No invoice
            </th>
            <th scope="col" className="px-6 py-3">
              Customer
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3">
              Total Harga
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item: ISale, index: number) => (
            <tr
              key={index}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
            >
              <td className="px-6 py-4">
                {item.transaction_date?.split("T")[0]}
              </td>
              <td className="px-6 py-4">{item.invoice_id}</td>
              <td className="px-6 py-4">{item.customer_name}</td>
              <td className="px-6 py-4">{item.detail.length}</td>
              <td className="px-6 py-4">
                Rp.{item.total_price.toLocaleString("id-ID")}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDropdownToggle(index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <BsThreeDotsVertical />
                </button>
                {dropdownOpen === index && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-10">
                    <ul>
                      <li className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <Link href={`/detail/${item.id}`}>Detail</Link>
                      </li>
                      <li className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <Link href={`/edit/${item.id}`}>Edit</Link>
                      </li>
                      <li className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <DeleteModal
                          id={item.id}
                          onDeleteSuccess={() => refetch()}
                        />
                      </li>
                    </ul>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col items-end gap-4 m-4">
        <ActionPage />
      </div>
    </div>
  );
};

export default TableComp;
