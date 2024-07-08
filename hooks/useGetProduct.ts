import { api } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";

export const useGetProduct = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const res = await api.get("/product");
      return res.data?.data;
    },
  });

  return { data, isLoading, isError, error };
};
