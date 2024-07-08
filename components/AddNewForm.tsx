"use client";

import { useGetProduct } from "@/hooks/useGetProduct";
import { IRow, Products } from "@/interface/interface";
import { api } from "@/libs/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { formSchema } from "../libs/validationScheme";
import { useRouter } from "next/navigation";

interface FormData {
  invoice: string;
  customer: string;
  date: string;
  rows: IRow[];
  tax: number;
  discount: number;
  subTotal?: number;
  total_price?: number;
}

const AddNewForm = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice: "",
      customer: "",
      date: "",
      rows: [{ name: "", price: 0, qty: 0, total: 0, product_id: 0 }],
      tax: 0,
      total_price: 0,
      discount: 0,
      subTotal: 0,
    },
  });
  const { mutate } = useMutation({
    mutationKey: ["postProduct"],
    mutationFn: async (payload: IRow) => {
      const res = await api.post("/sale", payload);
      console.log(res.data);
    },
    onSuccess: () => {
      console.log("Success");
      router.push("/");
    },
    onError: () => {
      console.log("Error");
    },
  });
  const { data } = useGetProduct();
  const { fields, append } = useFieldArray({
    control,
    name: "rows",
  });

  const watchRows = watch("rows");
  const watchTax = watch("tax");
  const watchDiscount = watch("discount");

  useEffect(() => {
    const subTotal = watchRows.reduce((sum, row) => sum + (row.total ?? 0), 0);
    const totalWithTax = subTotal + (subTotal * (watchTax ?? 0)) / 100;
    const total_price =
      totalWithTax - (totalWithTax * (watchDiscount ?? 0)) / 100;

    setValue("subTotal", subTotal);
    setValue("total_price", total_price);
  }, [watchRows, watchTax, watchDiscount, setValue]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("id-ID");
  };

  const handleAddRow = () => {
    append({ name: "", price: 0, qty: 0, total: 0 });
  };

  const handleChooseProduct = (index: number, id: number) => {
    const findProduct = data?.find((item: Products) => item.id === id);
    // console.log(findProduct);

    if (findProduct) {
      setValue(`rows.${index}.product_id`, findProduct.id);
      setValue(`rows.${index}.name`, findProduct.name);
      setValue(`rows.${index}.price`, findProduct.price);
      const qty = watchRows[index]?.qty ?? 0;
      setValue(`rows.${index}.total`, findProduct.price * qty);
    }
  };

  const handleInputChange = (
    index: number,
    field: keyof IRow,
    value: string | number
  ) => {
    const newRows = [...watchRows];
    if (field === "price" || field === "qty") {
      value = Number(value);
      newRows[index][field] = value;
      newRows[index].total =
        (newRows[index].price ?? 0) * (newRows[index].qty ?? 0);
      setValue("rows", newRows);
    }
  };

  const handleTaxChange = (value: string | number) => {
    const taxValue = Number(value);
    setValue("tax", taxValue);
  };

  const handleDiscountChange = (value: string | number) => {
    const discountValue = Number(value);
    setValue("discount", discountValue);
  };

  const onSubmit = async (data: FormData) => {
    // console.log(data);

    const payload = {
      invoice_id: data.invoice,
      customer_name: data.customer,
      tax: data.tax + "%",
      subtotal: watch("subTotal"),
      discount: data.discount + "%",
      total_price: watch("total_price"),
      detail: fields.map((field: any) => ({
        product_id: field.product_id,
        price: field.price,
        quantity: field.qty,
      })),
    };

    mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full flex gap-8 mb-2 justify-between">
        <div className="w-[48%]">
          <label
            htmlFor="input-invoice"
            className="block text-[20px] font-semibold text-black"
          >
            Invoice
          </label>
          <Controller
            name="invoice"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="input-invoice"
                className={`bg-gray-50 border ${
                  errors.invoice ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="Invoice"
              />
            )}
          />
          {errors.invoice && (
            <p className="text-red-500 text-xs mt-1">
              {errors.invoice.message}
            </p>
          )}
          <label
            htmlFor="input-customer"
            className="block text-[20px] font-semibold text-black"
          >
            Customer
          </label>
          <Controller
            name="customer"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="input-customer"
                className={`bg-gray-50 border ${
                  errors.customer ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="Customer"
              />
            )}
          />
          {errors.customer && (
            <p className="text-red-500 text-xs mt-1">
              {errors.customer.message}
            </p>
          )}
        </div>
        <div className="w-[48%]">
          <label
            htmlFor="input-date"
            className="block text-[20px] font-semibold text-black"
          >
            Date
          </label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                id="input-date"
                className={`bg-gray-50 border ${
                  errors.date ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              />
            )}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
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
            {fields.map((field, index) => (
              <tr key={field.id} className="bg-white dark:bg-gray-800">
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <Controller
                    name={`rows.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id={`name-${index}`}
                        className={`bg-gray-50 border ${
                          errors.rows?.[index]?.name
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        onChange={(e) => {
                          field.onChange(e);
                          handleChooseProduct(index, Number(e.target.value));
                        }}
                      >
                        {data?.map((item: Products) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.rows?.[index]?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.rows[index]?.name?.message}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Controller
                    name={`rows.${index}.price`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`bg-gray-50 border ${
                          errors.rows?.[index]?.price
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="Rp."
                        required
                        readOnly
                      />
                    )}
                  />
                </td>
                <td className="px-6 py-4">
                  <Controller
                    name={`rows.${index}.qty`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className={`bg-gray-50 border ${
                          errors.rows?.[index]?.qty
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="Qty"
                        onChange={(e) => {
                          field.onChange(e);
                          handleInputChange(index, "qty", e.target.value);
                        }}
                        required
                      />
                    )}
                  />
                  {errors.rows?.[index]?.qty && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.rows[index]?.qty?.message}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  Rp.{formatCurrency(watchRows[index]?.total ?? 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg mt-5"
          type="button"
          onClick={handleAddRow}
        >
          Add Row
        </button>
      </div>

      <div className="flex flex-col items-end  gap-4 mt-5">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-medium font-semibold">Subtotal:</label>
            <h1 className="text-medium font-semibold">
              Rp.{formatCurrency(watch("subTotal") ?? 0)}
            </h1>
          </div>
          <label
            htmlFor="input-tax"
            className="block text-medium font-semibold text-black"
          >
            Tax (%)
          </label>
          <Controller
            name="tax"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                id="input-tax"
                className={`bg-gray-50 border ${
                  errors.tax ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="Tax"
                onChange={(e) => {
                  field.onChange(e);
                  handleTaxChange(e.target.value);
                }}
              />
            )}
          />
          <label
            htmlFor="input-discount"
            className="block text-medium font-semibold text-black"
          >
            discont (%)
          </label>
          <Controller
            name="discount"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                id="input-discount"
                className={`bg-gray-50 border ${
                  errors.discount ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="Discount"
                onChange={(e) => {
                  field.onChange(e);
                  handleDiscountChange(e.target.value);
                }}
              />
            )}
          />

          <div className="flex justify-between items-center">
            <label className="text-medium font-semibold">Grand Total:</label>
            <h1 className="text-medium font-semibold">
              Rp.{formatCurrency(watch("total_price") ?? 0)}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex gap-4 w-full mt-5">
        <button
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
          type="reset"
        >
          Reset
        </button>
        <button
          className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddNewForm;
