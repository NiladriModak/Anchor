import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "../apis/api";

export const useAnalytics = () => {
  return useQuery({
    queryKey: ["allAnalytics"],
    queryFn: () => getAnalytics(),
  });
};

// export default useAnalytics;
