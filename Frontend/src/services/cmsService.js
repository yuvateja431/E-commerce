import api from "./api";
/* ================= FAQ Service ================= */
export const getFAQs = async (status, search) => {
    const params = new URLSearchParams();
    if (status)
        params.append("status", status);
    if (search)
        params.append("search", search);
    const response = await api.get(`/faqs?${params.toString()}`);
    return response.data?.data ?? [];
};
export const getFAQById = async (id) => {
    const response = await api.get(`/faqs/${id}`);
    return response.data.data;
};
export const createFAQ = async (data) => {
    const response = await api.post("/faqs", data);
    return response.data.data;
};
export const updateFAQ = async (id, data) => {
    const response = await api.put(`/faqs/${id}`, data);
    return response.data.data;
};
export const deleteFAQ = async (id) => {
    await api.delete(`/faqs/${id}`);
};
/* ================= Content Page Service ================= */
export const getContentPage = async (pageKey) => {
    const response = await api.get(`/content/${pageKey}`);
    return response.data.data;
};
export const upsertContentPage = async (pageKey, data) => {
    const response = await api.put(`/content/${pageKey}`, data);
    return response.data.data;
};
/* ================= Contact Service ================= */
export const getContactSettings = async () => {
    const response = await api.get("/contact/settings");
    return response.data.data;
};
export const updateContactSettings = async (data) => {
    const response = await api.put("/contact/settings", data);
    return response.data.data;
};
export const createContactMessage = async (data) => {
    const response = await api.post("/contact/messages", data);
    return response.data.data;
};
export const getContactMessages = async (status, search) => {
    const params = new URLSearchParams();
    if (status)
        params.append("status", status);
    if (search)
        params.append("search", search);
    const response = await api.get(`/contact/messages?${params.toString()}`);
    return response.data?.data ?? [];
};
export const getContactMessageById = async (id) => {
    const response = await api.get(`/contact/messages/${id}`);
    return response.data.data;
};
export const updateContactMessageStatus = async (id, status) => {
    const response = await api.put(`/contact/messages/${id}`, {
        status,
    });
    return response.data.data;
};
export const deleteContactMessage = async (id) => {
    await api.delete(`/contact/messages/${id}`);
};
