import { api } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";

export const useDelete = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const res = await api.get("/sale");
      return res.data;
    },
  });

  return { data, isLoading, isError, error };
};
