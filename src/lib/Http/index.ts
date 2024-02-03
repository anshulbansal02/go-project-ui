import axios, { AxiosInstance } from "axios";

export class HTTP {
  private transport: AxiosInstance;

  constructor(baseURL: string | URL) {
    this.transport = axios.create({
      baseURL: baseURL.toString(),
      paramsSerializer: (params) => {
        return new URLSearchParams(params).toString();
      },
    });
  }

  async get<ResponseType>(
    endpoint: string,
    params?: unknown
  ): Promise<ResponseType> {
    const res = await this.transport.get(endpoint, { params });
    return res.data as ResponseType;
  }

  async post<ResponseType>(
    endpoint: string,
    body?: unknown,
    params?: unknown
  ): Promise<ResponseType> {
    const res = await this.transport.post(endpoint, body, { params });
    return res.data as ResponseType;
  }

  async patch<ResponseType>(
    endpoint: string,
    body?: unknown,
    params?: unknown
  ): Promise<ResponseType> {
    const res = await this.transport.patch(endpoint, body, { params });
    return res.data as ResponseType;
  }
}
