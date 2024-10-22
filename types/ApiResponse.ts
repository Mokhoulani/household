export type ApiResponse<T> = {
  data: T;
  message: string;
  error: Error[] | null;
};
