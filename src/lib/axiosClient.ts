import axios, { AxiosError } from "axios";

// Khởi tạo một Axios instance dùng chung ở Client
export const axiosClient = axios.create({
    baseURL: "/api", // Next.js API Routes (BFF)
    timeout: 10000,
});

// Interceptor xử lý logic trả về lỗi chung cho mọi request Frontend
axiosClient.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError<any>) => {
        // Trích xuất thông báo lỗi an toàn
        const errMess =
            error.response?.data?.error?.message ||
            error.response?.data?.message ||
            error.message ||
            "Unknown error occurred";

        // Ném lỗi để các file trong src/fetching catch lại
        return Promise.reject(new Error(errMess));
    }
);
