export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  status: "Active" | "Inactive";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateFAQDTO {
  question: string;
  answer: string;
  displayOrder?: number;
  status?: "Active" | "Inactive";
}

export interface UpdateFAQDTO {
  question?: string;
  answer?: string;
  displayOrder?: number;
  status?: "Active" | "Inactive";
}

export interface ContentPageItem {
  id: string;
  pageKey: "shipping-policy" | "returns-refunds";
  pageTitle: string;
  shortDescription?: string | null;
  content: string;
  status: "Active" | "Inactive";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UpsertContentPageDTO {
  pageTitle: string;
  shortDescription?: string;
  content: string;
  status?: "Active" | "Inactive";
}

export interface ContactSettingsItem {
  id: string;
  businessName: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  googleMapsUrl?: string | null;
  businessHours?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  youtubeUrl?: string | null;
  status: "Active" | "Inactive";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UpdateContactSettingsDTO {
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
  status?: "Active" | "Inactive";
}

export interface ContactMessageItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: "New" | "Read" | "Replied" | "Closed";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateContactMessageDTO {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface UpdateContactMessageDTO {
  status: "New" | "Read" | "Replied" | "Closed";
}
