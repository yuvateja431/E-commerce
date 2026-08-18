import api from "./api";
import type {
  FAQ,
  CreateFAQRequest,
  UpdateFAQRequest,
  ContentPage,
  UpsertContentPageRequest,
  ContactSettings,
  ContactMessage,
  CreateContactMessageRequest,
  ApiResponse,
} from "../types/cms";

/* ================= FAQ Service ================= */
export const getFAQs = async (status?: string, search?: string): Promise<FAQ[]> => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (search) params.append("search", search);

  const response = await api.get<ApiResponse<FAQ[]>>(`/faqs?${params.toString()}`);
  return response.data?.data ?? [];
};

export const getFAQById = async (id: string): Promise<FAQ> => {
  const response = await api.get<ApiResponse<FAQ>>(`/faqs/${id}`);
  return response.data.data;
};

export const createFAQ = async (data: CreateFAQRequest): Promise<FAQ> => {
  const response = await api.post<ApiResponse<FAQ>>("/faqs", data);
  return response.data.data;
};

export const updateFAQ = async (id: string, data: UpdateFAQRequest): Promise<FAQ> => {
  const response = await api.put<ApiResponse<FAQ>>(`/faqs/${id}`, data);
  return response.data.data;
};

export const deleteFAQ = async (id: string): Promise<void> => {
  await api.delete(`/faqs/${id}`);
};

/* ================= Content Page Service ================= */
export const getContentPage = async (
  pageKey: "shipping-policy" | "returns-refunds"
): Promise<ContentPage> => {
  const response = await api.get<ApiResponse<ContentPage>>(`/content/${pageKey}`);
  return response.data.data;
};

export const upsertContentPage = async (
  pageKey: "shipping-policy" | "returns-refunds",
  data: UpsertContentPageRequest
): Promise<ContentPage> => {
  const response = await api.put<ApiResponse<ContentPage>>(`/content/${pageKey}`, data);
  return response.data.data;
};

/* ================= Contact Service ================= */
export const getContactSettings = async (): Promise<ContactSettings> => {
  const response = await api.get<ApiResponse<ContactSettings>>("/contact/settings");
  return response.data.data;
};

export const updateContactSettings = async (
  data: Partial<ContactSettings>
): Promise<ContactSettings> => {
  const response = await api.put<ApiResponse<ContactSettings>>("/contact/settings", data);
  return response.data.data;
};

export const createContactMessage = async (
  data: CreateContactMessageRequest
): Promise<ContactMessage> => {
  const response = await api.post<ApiResponse<ContactMessage>>("/contact/messages", data);
  return response.data.data;
};

export const getContactMessages = async (
  status?: string,
  search?: string
): Promise<ContactMessage[]> => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (search) params.append("search", search);

  const response = await api.get<ApiResponse<ContactMessage[]>>(
    `/contact/messages?${params.toString()}`
  );
  return response.data?.data ?? [];
};

export const getContactMessageById = async (id: string): Promise<ContactMessage> => {
  const response = await api.get<ApiResponse<ContactMessage>>(`/contact/messages/${id}`);
  return response.data.data;
};

export const updateContactMessageStatus = async (
  id: string,
  status: "New" | "Read" | "Replied" | "Closed"
): Promise<ContactMessage> => {
  const response = await api.put<ApiResponse<ContactMessage>>(`/contact/messages/${id}`, {
    status,
  });
  return response.data.data;
};

export const deleteContactMessage = async (id: string): Promise<void> => {
  await api.delete(`/contact/messages/${id}`);
};
