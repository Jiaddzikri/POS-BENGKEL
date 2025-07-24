import axios, { AxiosRequestConfig } from 'axios';
import { Dispatch, useCallback, useState } from 'react';

interface ApiState<T> {
  data: T | null;
  error: string | object | null;
  isLoading: boolean;
}

type Execute<T> = (url: string, method?: string, body?: Record<string, any>) => Promise<ApiResponse<T> | undefined>;

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | object | null;
}

export const useApi = <T>(): [Execute<T>, ApiState<T>, Dispatch<ApiState<T>>] => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute: Execute<T> = useCallback(async (url: string, method = 'GET', body?: Record<string, any>) => {
    if (typeof url !== 'string' || !url) return;
    setState({ data: null, error: null, isLoading: true });

    try {
      const options: AxiosRequestConfig = {
        method,
        url: url,
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
  }, []);

  return [execute, state, setState];
};
