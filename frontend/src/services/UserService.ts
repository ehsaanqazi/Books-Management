import axios from "axios";
import Cookies from "universal-cookie";

const API_URL = "https://interview.wallayl.com/api";
export class UserService {
  public static async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    return await axios
      .post(`${API_URL}/user/register`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return {
          statusCode: response.status,
          status: response.data.status,
          message: response.data.message,
          data: response.data,
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

  public static async login(data: { email: string; password: string }) {
    return await axios
      .post(`${API_URL}/user/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        new Cookies().set("token", response.data.token, { path: "/" });
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
}
