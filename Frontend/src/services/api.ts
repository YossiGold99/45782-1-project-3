import axios from "axios";

const API_URL =
  (import.meta.env?.VITE_API_URL as string) || "http://localhost:3020";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginResponse {
  token: string;
  user: any;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role?: "User" | "Admin";
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (data: RegisterData): Promise<LoginResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const getUsers = async (page: number = 1, search: string = "") => {
  const response = await api.get("/users", {
    params: { page, search },
  });
  return response.data;
};

export const followUser = async (userId: number) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
};

export const unfollowUser = async (userId: number) => {
  const response = await api.delete(`/users/${userId}/follow`);
  return response.data;
};

export const getFollowers = async (userId: number, page: number = 1) => {
  const response = await api.get(`/users/${userId}/followers`, {
    params: { page },
  });
  return response.data;
};

export const getFollowing = async (userId: number, page: number = 1) => {
  const response = await api.get(`/users/${userId}/following`, {
    params: { page },
  });
  return response.data;
};

export const getTours = async (
  page: number = 1,
  search: string = "",
  destination: string = "",
  includeInactive: boolean = false,
  limit: number = 10
) => {
  const response = await api.get("/tours", {
    params: { page, search, destination, includeInactive, limit },
  });
  return response.data;
};

export const getTour = async (id: number) => {
  const response = await api.get(`/tours/${id}`);
  return response.data;
};

export const createTour = async (tourData: any) => {
  const response = await api.post("/tours", tourData);
  return response.data;
};

export const updateTour = async (id: number, tourData: any) => {
  const response = await api.put(`/tours/${id}`, tourData);
  return response.data;
};

export const deleteTour = async (id: number) => {
  const response = await api.delete(`/tours/${id}`);
  return response.data;
};

export const createBooking = async (
  tourId: number,
  numberOfPersons: number
) => {
  const response = await api.post("/bookings", { tourId, numberOfPersons });
  return response.data;
};

export const getMyBookings = async (page: number = 1) => {
  const response = await api.get("/bookings/my", {
    params: { page },
  });
  return response.data;
};

export const getAllBookings = async (page: number = 1) => {
  const response = await api.get("/bookings/all", {
    params: { page },
  });
  return response.data;
};

export const deleteBooking = async (bookingId: number) => {
  const response = await api.delete(`/bookings/${bookingId}`);
  return response.data;
};

export const likeTour = async (tourId: number) => {
  const response = await api.post(`/likes/tours/${tourId}/like`);
  return response.data;
};

export const unlikeTour = async (tourId: number) => {
  const response = await api.delete(`/likes/tours/${tourId}/like`);
  return response.data;
};

export const checkTourLiked = async (tourId: number) => {
  const response = await api.get(`/likes/tours/${tourId}/liked`);
  return response.data;
};

export const exportUsersCSV = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/export/users/csv`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "users.csv";
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportUsersExcel = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/export/users/excel`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "users.xlsx";
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToursCSV = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/export/tours/csv`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tours.csv";
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToursExcel = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/export/tours/excel`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tours.xlsx";
  a.click();
  window.URL.revokeObjectURL(url);
};

export default api;
