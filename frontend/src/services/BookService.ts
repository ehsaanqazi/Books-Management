import axios from "axios";
import Cookies from "universal-cookie";

const API_URL = "http://localhost:5000/api";
export class BooksService {
  public static async getBooks() {
    const token = new Cookies().get("token");
    return await axios
      .get(`${API_URL}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return {
          statusCode: response.status,
          status: response.data.status,
          data: response.data.data,
          message: response.data.message,
        };
      })
      .catch((error) => {
        return {
          statusCode: error.response.status,
          status: error.response.data.status,
          message: error.response.data.message,
          data: error.response.data.data,
        };
      });
  }

  public static async addBook(data: any) {
    const token = new Cookies().get("token");
    return await axios
      .post(`${API_URL}/books`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return {
          statusCode: response.status,
          status: response.data.status,
          message: response.data.message,
          data: response.data.data,
        };
      })
      .catch((error) => {
        return {
          statusCode: error.response.status,
          status: error.response.data.status,
          message: error.response.data.message,
          data: error.response.data.data,
        };
      });
  }

  public static async deleteBook(id: number) {
    const token = new Cookies().get("token");
    return await axios
      .delete(`${API_URL}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return {
          statusCode: response.status,
          status: response.data.status,
          message: response.data.message,
          data: response.data.data,
        };
      })
      .catch((error) => {
        return {
          statusCode: error.response.status,
          status: error.response.data.status,
          message: error.response.data.message,
          data: error.response.data.data,
        };
      });
  }

  public static async getBookById(id: number) {
    const token = new Cookies().get("token");
    return await axios
      .get(`${API_URL}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => ({
        statusCode: response.status,
        status: response.data.status,
        data: response.data.data,
        message: response.data.message,
      }))
      .catch((error) => ({
        statusCode: error.response.status,
        status: error.response.data.status,
        message: error.response.data.message,
        data: error.response.data.data,
      }));
  }

  public static async updateBook(id: number, data: any) {
    const token = new Cookies().get("token");
    return await axios
      .put(`${API_URL}/books/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => ({
        statusCode: response.status,
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      }))
      .catch((error) => ({
        statusCode: error.response.status,
        status: error.response.data.status,
        message: error.response.data.message,
        data: error.response.data.data,
      }));
  }
}
