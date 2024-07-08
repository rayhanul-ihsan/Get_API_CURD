"use client";
import { useGetSalebyId } from "@/hooks/useGetsalebyId";
import { IDetail } from "@/interface/interface";
import { useParams } from "next/navigation";

const Detail = () => {
  const { id } = useParams();
  const { data, isError, error, isLoading } = useGetSalebyId(+id);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("id-ID");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Unknown error"}</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex gap-8 mb-2 justify-between">
        <div className="w-[48%]">
          <label
            htmlFor="input-invoice"
            className="block text-[20px] font-semibold text-black"
          >
            Invoice
          </label>
          <input
            type="text"
            id="input-invoice"
            className="bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={data.invoice_id}
            readOnly
          />
          <label
            htmlFor="input-customer"
            className="block text-[20px] font-semibold text-black"
          >
            Customer
          </label>
          <input
            type="text"
            id="input-customer"
            className="bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={data.customer_name}
            readOnly
          />
        </div>
        <div className="w-[48%]">
          <label
            htmlFor="input-date"
            className="block text-[20px] font-semibold text-black"
          >
            Date
          </label>
          <input
            type="date"
            id="input-date"
            className="bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={data.transaction_date.split("T")[0]}
            readOnly
          />
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Qty
              </th>
              <th scope="col" className="px-6 py-3">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.detail?.map((Item: IDetail, index: number) => (
              <tr key={index} className="bg-white dark:bg-gray-800">
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <input
                    type="text"
                    className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={data.invoice_id}
                    readOnly
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    // prefix="Rp."
                    value={formatCurrency(Item.price)}
                    readOnly
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={Item.quantity}
                    readOnly
                  />
                </td>
                <td className="px-6 py-4">Rp.{formatCurrency(Item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col items-end  gap-4 mt-5">
          <div className="space-y-3">
            <div className="flex justify-start gap-4 items-center">
              <label className="text-medium font-semibold">Subtotal:</label>
              <h1 className="text-medium font-semibold">
                Rp.{formatCurrency(data.subtotal)}
              </h1>
            </div>
            <label
              htmlFor="input-tax"
              className="block text-medium font-semibold text-black"
            >
              Tax (%)
            </label>
            <input
              type="number"
              id="input-tax"
              value={parseFloat(data.tax)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            <label
              htmlFor="input-discount"
              className="block text-medium font-semibold text-black"
            >
              discount (%)
            </label>
            <input
              type="number"
              id="input-discount"
              value={parseFloat(data.discount)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            <div className="flex justify-start gap-4 items-center">
              <label className="text-medium font-semibold">GrandTotal:</label>
              <h1 className="text-medium font-semibold">
                Rp.{formatCurrency(data.total_price)}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
