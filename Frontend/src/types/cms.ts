export interface FAQ {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  displayOrder?: number;
  status?: "Active" | "Inactive";
}

export interface UpdateFAQRequest {
  question?: string;
  answer?: string;
  displayOrder?: number;
  status?: "Active" | "Inactive";
}

export interface ContentPage {
  id: string;
  pageKey: "shipping-policy" | "returns-refunds";
  pageTitle: string;
  shortDescription?: string;
  content: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface UpsertContentPageRequest {
  pageTitle: string;
  shortDescription?: string;
  content: string;
  status?: "Active" | "Inactive";
}

export interface ContactSettings {
  id: string;
  businessName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  googleMapsUrl?: string;
  businessHours?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "New" | "Read" | "Replied" | "Closed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactMessageRequest {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}
