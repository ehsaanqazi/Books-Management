export class SuccessResponse {
  status: boolean;
  message: string;
  data?: any;
}

export class ErrorResponse {
  status: boolean;
  error: string;
}

export type ApiResponse = SuccessResponse | ErrorResponse;
