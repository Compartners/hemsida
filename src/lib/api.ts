const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api";

let csrfToken: string | null = null;

/* ============================================================
   TYPES
   ============================================================ */

export type ApiProduct = {
  id: number;
  name: string;
  external_id: string;
  product_type: "phone" | "accessory";
  base_price: string | number;
  brand: string;
  gtin: string;
  mpn: string;
  image_url: string;
  product_url: string;
  availability: string;
  active: boolean;
};

export type ApiCompany = {
  id: number;
  name: string;
  company_code: string;
  organization_number: string;
  price_markup: string | number;
  has_phone_policy: boolean;
};

export type CompanyLoginResponse = {
  detail: string;
  company: ApiCompany;
};

/* ============================================================
   CSRF
   ============================================================ */

async function getCsrfToken(): Promise<string> {
  const response = await fetch(
    `${API_URL}/auth/csrf/`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte hämta CSRF-token.");
  }

  const data = await response.json();

  csrfToken = data.csrfToken;

  return csrfToken;
}

/* ============================================================
   FETCH
   ============================================================ */

function isUnsafeMethod(method?: string) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(
    (method || "GET").toUpperCase(),
  );
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const method = (options.method || "GET").toUpperCase();

  if (isUnsafeMethod(method) && !csrfToken) {
    await getCsrfToken();
  }

  const headers = new Headers(options.headers);

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (isUnsafeMethod(method) && csrfToken) {
    headers.set("X-CSRFToken", csrfToken);
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      method,
      credentials: "include",
      headers,
    },
  );

  if (response.status === 403) {
    const text = await response.text();

    if (text.toLowerCase().includes("csrf")) {
      csrfToken = null;
    }

    throw new Error(
      "CSRF-valideringen misslyckades.",
    );
  }

  const contentType =
    response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        "Något gick fel.",
    );
  }

  return data;
}

/* ============================================================
   AUTH
   ============================================================ */

export async function initializeCsrf() {
  return getCsrfToken();
}

export async function companyLogin(
  companyCode: string,
) {
  return apiFetch<CompanyLoginResponse>(
    "/company/login/",
    {
      method: "POST",
      body: JSON.stringify({
        company_code: companyCode,
      }),
    },
  );
}

export async function companyLogout() {
  return apiFetch<{ detail: string }>(
    "/company/logout/",
    {
      method: "POST",
    },
  );
}

export async function getCompany() {
  return apiFetch<ApiCompany>(
    "/company/me/",
  );
}

/* ============================================================
   PRODUCTS
   ============================================================ */

export async function getProducts() {
  return apiFetch<ApiProduct[]>(
    "/products/",
  );
}

/* ============================================================
   COMPANY PRODUCTS
   ============================================================ */

export async function getCompanyPhones() {
  return apiFetch<ApiProduct[]>(
    "/company/phones/",
  );
}