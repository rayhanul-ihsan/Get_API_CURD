import { api } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchSale = () => {
  return useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const res = await api.get("/sale");
      return res.data;
    },
  });
};
