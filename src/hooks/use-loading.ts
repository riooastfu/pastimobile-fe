import { useLoadingContext } from "../providers/loading-provider";

export const useLoading = () => {
  const { isLoading, showLoading, hideLoading } = useLoadingContext();
  return { isLoading, showLoading, hideLoading };
};
