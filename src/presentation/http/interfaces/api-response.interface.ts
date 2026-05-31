export interface ApiResponseBase {
  success: boolean;
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}

export interface SuccessApiResponse<T = unknown> extends ApiResponseBase {
  success: true;
  data: T;
}

export interface ErrorApiResponse extends ApiResponseBase {
  success: false;
  error: string;
}
