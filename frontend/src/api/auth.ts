import apiClient from "@/lib/apiClient";
import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  UserResponse,
} from "@/types/auth";
import type { Response } from "@/types/common";

export const registerUser = async (registerDto: RegisterDto) => {
  try {
    const response = await apiClient.post<Response<LoginResponse>>(
      "/auth/register",
      registerDto
    );
    localStorage.setItem("token", response.data.data.token);
    return response.data.data.user;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred during login");
  }
};

export const loginUser = async (loginDto: LoginDto) => {
  try {
    const response = await apiClient.post<Response<LoginResponse>>(
      "/auth/login",
      loginDto
    );
    localStorage.setItem("token", response.data.data.token);
    return response.data.data.user;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred during login");
  }
};

export const getUser = async () => {
  try {
    const response = await apiClient.get<Response<UserResponse>>("/auth/me");
    return response.data.data.user;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching user");
  }
};
