// services/ApiService.ts

interface ApiOptions {
  headers?: HeadersInit;
  body?: any;
  method?: string;
}

interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Método principal para realizar solicitudes a la API
   */
  async request<T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Preparar las opciones para la solicitud
      const headers = this.prepareHeaders(options.headers || {});

      // Configurar el método y cuerpo de la solicitud
      const method = options.method || "GET";
      let fetchOptions: RequestInit = { method, headers };

      // Añadir cuerpo a la solicitud si es necesario
      if (
        options.body &&
        (method === "POST" || method === "PUT" || method === "PATCH")
      ) {
        fetchOptions.body = JSON.stringify(options.body);
      }

      console.log(
        `ApiService: ${method} ${this.baseURL}${endpoint}`,
        fetchOptions
      );

      // Realizar la solicitud
      const response = await fetch(`${this.baseURL}${endpoint}`, fetchOptions);
      const status = response.status;

      // Comprobar si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      // Procesar la respuesta
      let data: any = null;
      if (isJson) {
        data = await response.json();
      } else if (status !== 204) {
        // No Content
        data = await response.text();
      }

      // Si la respuesta no es exitosa, formatear el error
      if (!response.ok) {
        return { data: null, error: this.formatErrorMessage(data), status };
      }

      return { data, error: null, status };
    } catch (error) {
      console.error("ApiService error:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Error de red desconocido",
        status: 0,
      };
    }
  }

  /**
   * Prepara los headers incluyendo el token de autenticación si existe
   */
  private prepareHeaders(customHeaders: HeadersInit = {}): Headers {
    const headers = new Headers(customHeaders);

    // Establecer Content-Type si no está definido
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    // Añadir token de autenticación si existe
    const token = this.getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Obtiene el token del localStorage
   */
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  /**
   * Formatea los mensajes de error desde la API
   */
  private formatErrorMessage(error: any): string {
    if (!error) return "Error desconocido";

    if (typeof error === "string") return error;

    if (error.mensaje) return error.mensaje;

    if (error.message) return error.message;

    return "Error en la solicitud";
  }

  /**
   * Métodos de conveniencia para diferentes tipos de solicitudes
   */
  async get<T>(
    endpoint: string,
    headers?: HeadersInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", headers });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    headers?: HeadersInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body, headers });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    headers?: HeadersInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body, headers });
  }

  async delete<T>(
    endpoint: string,
    headers?: HeadersInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }
}

// Exportar una instancia con la URL base de la API
export const apiService = new ApiService("http://localhost:3055");

export default ApiService;
