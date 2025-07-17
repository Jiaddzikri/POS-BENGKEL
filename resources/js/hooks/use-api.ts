import axios, { AxiosRequestConfig, Method } from 'axios';
import { useCallback, useState } from 'react';

interface ApiState<T> {
  data: T | null;
  error: string | object | null;
  isLoading: boolean;
}

type Execute<T> = (body?: Record<string, any>) => Promise<ApiResponse<T>>;

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | object | null;
}

export const useApi = <T>(endpoint: string, method: Method = 'GET'): [Execute<T>, ApiState<T>] => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute: Execute<T> = useCallback(
    async (body?: Record<string, any>) => {
      setState({ data: null, error: null, isLoading: true });

      try {
        const options: AxiosRequestConfig = {
          method,
          url: endpoint,
          data: body,
        };

        const response = await axios<T>(options);

        const apiResponse: ApiResponse<T> = {
          success: true,
          data: response.data,
          error: null,
        };

        setState({ data: response.data, error: null, isLoading: false });
        return apiResponse;
      } catch (error) {
        let errorMessage: string | object = 'An unexpected error occurred';
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data || error.message;
        }

        const apiResponse: ApiResponse<T> = {
          success: false,
          data: null,
          error: errorMessage,
        };

        setState({ data: null, error: errorMessage, isLoading: false });
        return apiResponse;
      }
    },
    [endpoint, method],
  );

  return [execute, state];
};
