import axios, { AxiosInstance } from "axios";

export class HTTP {
  private transport: AxiosInstance;

  constructor(baseURL: string) {
    this.transport = axios.create({
      baseURL,
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
