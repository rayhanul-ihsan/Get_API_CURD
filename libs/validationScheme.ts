import { z } from "zod";

export const formSchema = z.object({
  invoice: z.string().min(1, { message: "Invoice is required" }),
  customer: z.string().min(1, { message: "Customer is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  tax: z.number().min(0, { message: "Tax should be 0 or greater" }).optional(),
  discount: z.number().min(0, { message: "Discount should be 0 or greater" }).optional(),
  rows: z.array(
    z.object({
      name: z.string().min(1, { message: "Product name is required" }),
      price: z.number().min(0, { message: "Price should be 0 or greater" }),
      qty: z.number().min(1, { message: "Quantity should be 1 or greater" }),
      total: z.number().min(0, { message: "Total should be 0 or greater" }),
      product_id: z.number().min(1, { message: "Product ID should be 1 or greater" }),
    })
  ),
});