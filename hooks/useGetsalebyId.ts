"use client";
import { api } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";

export const useGetSalebyId = (id: number) => {
  return useQuery({
    queryKey: ["data", id],
    queryFn: async () => {
      const res = await api.get(`/sale/${id}`);
      console.log("Response:", res);
      return res.data.data;
    },
  });
};
