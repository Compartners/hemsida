const API_URL =
  import.meta.env.VITE_API_URL || "https://hemsida-swart-six.vercel.app/api";

let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

// Lyssnare för när en session dör
// Kopplas mot router / auth-state.
let onSessionExpiredCallback: (() => void) | null = null;

export function onSessionExpired(callback: () => void) {
  onSessionExpiredCallback = callback;
}

/* ============================================================
   PRODUCT TYPES
   ============================================================ */

export type ProductType =
  | "phone"
  | "accessory";

export type ShopCategory =
  | "phone"
  | "case"
  | "screen_protector"
  | "charger"
  | "cable"
  | "powerbank"
  | "";


/* ============================================================
   API TYPES
   ============================================================ */

export type ApiProduct = {
  id: number;
  name: string;
  external_id: string;

  // Produktklassificering
  product_type: ProductType;
  shop_category?: ShopCategory;
  model_family?: string;

  // Pris
  base_price: string | number;

  /**
   * Priset från Django som ska användas i webshoppen.
   *
   * För inloggad kund kan backend redan ha applicerat
   * företagets pris/påslag.
   */
  price?: string | number | null;

  // Produktmetadata
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
   PRODUCT FILTERS
   ============================================================ */

export type ProductSort =
  | "recommended"
  | "price_asc"
  | "price_desc"
  | "name_asc";

export type ProductFilters = {
  productType?: ProductType | "all";
  shopCategory?: ShopCategory | "all";
  brand?: string;
  modelFamily?: string;
  query?: string;
  inStockOnly?: boolean;
  sort?: ProductSort;
};


/* ============================================================
   CSRF
   ============================================================ */

async function getCsrfToken(): Promise<string> {
  // Förhindra flera parallella CSRF-anrop.
  if (csrfPromise) {
    return csrfPromise;
  }

  csrfPromise = (async () => {
    try {
      const response = await fetch(
        `${API_URL}/auth/csrf/`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Kunde inte hämta CSRF-token."
        );
      }

      const data = await response.json();

      csrfToken = data.csrfToken;

      return csrfToken as string;
    } finally {
      csrfPromise = null;
    }
  })();

  return csrfPromise;
}


/* ============================================================
   FETCH HELPERS
   ============================================================ */

function isUnsafeMethod(method?: string) {
  return [
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ].includes(
    (method || "GET").toUpperCase()
  );
}


async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const method = (
    options.method || "GET"
  ).toUpperCase();

  /* ----------------------------------------------------------
     CSRF
  ---------------------------------------------------------- */

  if (
    isUnsafeMethod(method) &&
    !csrfToken
  ) {
    await getCsrfToken();
  }

  const headers = new Headers(
    options.headers
  );

  if (
    options.body &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  if (
    isUnsafeMethod(method) &&
    csrfToken
  ) {
    headers.set(
      "X-CSRFToken",
      csrfToken
    );
  }

  /* ----------------------------------------------------------
     REQUEST
  ---------------------------------------------------------- */

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      method,
      credentials: "include",
      headers,
    }
  );

  /* ----------------------------------------------------------
     SESSION EXPIRED
  ---------------------------------------------------------- */

  if (response.status === 401) {
    if (onSessionExpiredCallback) {
      onSessionExpiredCallback();
    }

    throw new Error(
      "Sessionen har löpt ut. Vänligen logga in igen."
    );
  }

  /* ----------------------------------------------------------
     CSRF RETRY
  ---------------------------------------------------------- */

  if (
    response.status === 403 &&
    !isRetry
  ) {
    const text = await response
      .clone()
      .text();

    if (
      text
        .toLowerCase()
        .includes("csrf")
    ) {
      csrfToken = null;

      await getCsrfToken();

      return apiFetch<T>(
        endpoint,
        options,
        true
      );
    }
  }

  /* ----------------------------------------------------------
     RESPONSE
  ---------------------------------------------------------- */

  const contentType =
    response.headers.get(
      "content-type"
    );

  const data =
    contentType?.includes(
      "application/json"
    )
      ? await response.json()
      : null;

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      "Något gick fel."
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
  companyCode: string
) {
  return apiFetch<CompanyLoginResponse>(
    "/company/login/",
    {
      method: "POST",
      body: JSON.stringify({
        company_code: companyCode,
      }),
    }
  );
}


export async function companyLogout() {
  return apiFetch<{
    detail: string;
  }>(
    "/company/logout/",
    {
      method: "POST",
    }
  );
}


export async function getCompany() {
  return apiFetch<ApiCompany>(
    "/company/me/"
  );
}


/* ============================================================
   PRODUCTS
   ============================================================ */

/**
 * Hämtar produkter.
 *
 * Funktionen fungerar fortfarande helt utan argument:
 *
 *   getProducts()
 *
 * Men kan också användas med server-side-filter:
 *
 *   getProducts({
 *     productType: "accessory",
 *     shopCategory: "charger",
 *     brand: "Apple",
 *   })
 */
export async function getProducts(
  filters: ProductFilters = {}
) {
  const params =
    new URLSearchParams();

  /* ----------------------------------------------------------
     PRODUKTTYP
  ---------------------------------------------------------- */

  if (
    filters.productType &&
    filters.productType !== "all"
  ) {
    params.set(
      "product_type",
      filters.productType
    );
  }

  /* ----------------------------------------------------------
     WEBSHOPKATEGORI
  ---------------------------------------------------------- */

  if (
    filters.shopCategory &&
    filters.shopCategory !== "all"
  ) {
    params.set(
      "shop_category",
      filters.shopCategory
    );
  }

  /* ----------------------------------------------------------
     VARUMÄRKE
  ---------------------------------------------------------- */

  if (
    filters.brand &&
    filters.brand !== "all"
  ) {
    params.set(
      "brand",
      filters.brand
    );
  }

  /* ----------------------------------------------------------
     MODELLFAMILJ
  ---------------------------------------------------------- */

  if (
    filters.modelFamily &&
    filters.modelFamily !== "all"
  ) {
    params.set(
      "model_family",
      filters.modelFamily
    );
  }

  /* ----------------------------------------------------------
     SÖKNING
  ---------------------------------------------------------- */

  const normalizedQuery =
    filters.query?.trim();

  if (normalizedQuery) {
    params.set(
      "q",
      normalizedQuery
    );
  }

  /* ----------------------------------------------------------
     LAGER
  ---------------------------------------------------------- */

  if (filters.inStockOnly) {
    params.set(
      "in_stock",
      "true"
    );
  }

  /* ----------------------------------------------------------
     SORTERING
  ---------------------------------------------------------- */

  if (
    filters.sort &&
    filters.sort !== "recommended"
  ) {
    params.set(
      "sort",
      filters.sort
    );
  }

  /* ----------------------------------------------------------
     REQUEST
  ---------------------------------------------------------- */

  const queryString =
    params.toString();

  const endpoint =
    queryString
      ? `/products/?${queryString}`
      : "/products/";

  return apiFetch<ApiProduct[]>(
    endpoint
  );
}


/* ============================================================
   COMPANY PRODUCTS
   ============================================================ */

export async function getCompanyPhones() {
  return apiFetch<ApiProduct[]>(
    "/company/phones/"
  );
}


/* ============================================================
   COMPANY ORDERS
   ============================================================ */

export type ApiOrderItem = {
  id: number;

  product: {
    id: number;
    name: string;
    brand?: string;
    image_url?: string;
  };

  quantity: number;

  unit_price: string | number;

  line_total?: string | number;
};


export type ApiOrder = {
  id: number;

  order_number?: string;

  created_at: string;

  status?: string;

  ordered_by: string;

  organization_number: string;

  comment?: string;

  total_amount?: string | number;

  items: ApiOrderItem[];
};


export async function getCompanyOrders() {
  return apiFetch<ApiOrder[]>(
    "/company/orders/"
  );
}


export type CreateOrderItemPayload = {
  product_id?: number;
  product?: number;

  quantity: number;

  unit_price: number;
};


export type CreateOrderPayload = {
  ordered_by: string;

  organization_number?: string;

  comment?: string;

  items: CreateOrderItemPayload[];
};


export async function createOrder(
  payload: CreateOrderPayload
) {
  return apiFetch(
    "/company/orders/",
    {
      method: "POST",
      body: JSON.stringify(
        payload
      ),
    }
  );
}