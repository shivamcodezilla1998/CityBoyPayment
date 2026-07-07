import apiClient from './apiClient';

interface GetRedemptionsParams {
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const rewardsRedemptionService = {
  getRedemptions: async (
    params: GetRedemptionsParams,
    cursor: string | null = null,
    limit: number = 25,
    options: { signal?: AbortSignal } = {}
  ) => {
    const queryParams: Record<string, string> = { limit: String(limit) };
    if (cursor) queryParams.cursor = cursor;
    if (params.status && params.status !== 'all') queryParams.status = params.status;
    if (params.search) queryParams.search = params.search;
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;

    const searchParams = new URLSearchParams(queryParams);
    const url = `/api/admin/rewards/redemptions?${searchParams.toString()}`;

    const response = await apiClient.get(url, { signal: options.signal });
    return response.data;
  },

  approveRedemption: async (requestId: string) => {
    const response = await apiClient.patch(`/api/admin/rewards/redemptions/${requestId}/approve`);
    return response.data;
  },

  rejectRedemption: async (requestId: string, data: { reason: string }) => {
    const response = await apiClient.patch(`/api/admin/rewards/redemptions/${requestId}/reject`, data);
    return response.data;
  }
};
