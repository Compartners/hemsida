// Webbshop.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ShoppingBag,
  XCircle,
  Sparkles,
  ShieldCheck,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  companyLogin,
  companyLogout,
  getCompany,
  getProducts,
  type ApiCompany,
} from "@/lib/api";

import type {
  CartItem,
  Product,
  ProductTypeFilter,
  SortOption,
} from "../components/webshop/types";

import { mapProduct } from "../components/webshop/utils";
import { ShopHero } from "../components/webshop/ShopHero";
import { ProductFilters } from "../components/webshop/ProductFilters";
import { PhoneQuiz } from "../components/webshop/PhoneQuiz";
import { ProductCard } from "../components/webshop/ProductCard";
import { AccountCard } from "../components/webshop/AccountCard";
import { CartSummary } from "../components/webshop/CartSummary";
import { CheckoutModal } from "../components/webshop/CheckoutModal";
import { OrderHistoryModal } from "../components/webshop/OrderHistoryModal";


/* ============================================================
   CONSTANTS
   ============================================================ */

const PRODUCTS_PER_PAGE = 24;


/* ============================================================
   PRIORITERING / REKOMMENDERAT
   ============================================================ */

function getProductPriority(product: Product): number {
  const name = product.name.toLowerCase();
  let score = 0;

  // iPhone
  if (name.includes("iphone 17 pro")) score += 1000;
  else if (name.includes("iphone 17")) score += 950;
  else if (name.includes("iphone 16 pro")) score += 900;
  else if (name.includes("iphone 16")) score += 850;
  else if (name.includes("iphone 15 pro")) score += 800;
  else if (name.includes("iphone 15")) score += 750;

  // Samsung
  if (name.includes("galaxy s25 ultra")) score += 980;
  else if (name.includes("galaxy s25")) score += 920;
  else if (name.includes("galaxy s24 ultra")) score += 880;
  else if (name.includes("galaxy s24")) score += 840;
  else if (name.includes("galaxy a56")) score += 720;
  else if (name.includes("galaxy a36")) score += 700;

  // Populära tillbehör
  if (
    name.includes("20w") ||
    name.includes("25w") ||
    name.includes("45w")
  ) {
    score += 500;
  }

  if (name.includes("magsafe")) {
    score += 400;
  }

  if (product.productType === "phone") {
    score += 300;
  }

  if (product.stock) {
    score += 2000;
  }

  return score;
}


/* ============================================================
   PAGE
   ============================================================ */

export default function Webbshop() {
  const [query, setQuery] = useState("");

  const [productType, setProductType] =
    useState<ProductTypeFilter>("all");

  const [brand, setBrand] =
    useState("all");

  const [modelFamily, setModelFamily] =
    useState("all");

  const [inStockOnly, setInStockOnly] =
    useState(true);

  const [sortBy, setSortBy] =
    useState<SortOption>("recommended");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [account, setAccount] =
    useState<ApiCompany | null>(null);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [loadingAccount, setLoadingAccount] =
    useState(true);

  const [isCheckoutOpen, setIsCheckoutOpen] =
    useState(false);

  const [isOrderHistoryOpen, setIsOrderHistoryOpen] =
    useState(false);


  /* ==========================================================
     PRODUCTS
     ========================================================== */

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);

    try {
      const data = await getProducts();

      setProducts(
        data.map(mapProduct)
      );
    } catch (error) {
      console.error(
        "Kunde inte hämta produkter:",
        error
      );

      toast.error(
        "Kunde inte hämta produkter."
      );
    } finally {
      setLoadingProducts(false);
    }
  }, []);


  /* ==========================================================
     INIT
     ========================================================== */

  useEffect(() => {
    async function init() {
      try {
        const company =
          await getCompany();

        setAccount(company);
      } catch {
        // Oinloggad besökare är okej.
        setAccount(null);
      } finally {
        setLoadingAccount(false);
      }

      await fetchProducts();
    }

    init();
  }, [fetchProducts]);


  /* ==========================================================
     FEATURED PHONES
     ========================================================== */

  const topSellingPhones = useMemo(() => {
    return [...products]
      .filter(
        (product) =>
          product.productType === "phone" &&
          product.stock
      )
      .sort(
        (a, b) =>
          getProductPriority(b) -
          getProductPriority(a)
      )
      .slice(0, 4);
  }, [products]);


  const topPhoneIds = useMemo(
    () =>
      new Set(
        topSellingPhones.map(
          (product) =>
            product.id
        )
      ),
    [topSellingPhones]
  );


  /* ==========================================================
     DYNAMISKA FILTERALTERNATIV
     ========================================================== */

  const availableBrands = useMemo(() => {
    let source = products;

    if (productType !== "all") {
      source = source.filter(
        (product) =>
          product.productType ===
          productType
      );
    }

    return Array.from(
      new Set(
        source
          .map(
            (product) =>
              product.brand
          )
          .filter(
            (value) =>
              Boolean(value) &&
              value !==
                "Okänt varumärke"
          )
      )
    ).sort((a, b) =>
      a.localeCompare(
        b,
        "sv"
      )
    );
  }, [
    products,
    productType,
  ]);


  const availableModels = useMemo(() => {
    let source = products;

    if (productType !== "all") {
      source = source.filter(
        (product) =>
          product.productType ===
          productType
      );
    }

    if (brand !== "all") {
      source = source.filter(
        (product) =>
          product.brand === brand
      );
    }

    return Array.from(
      new Set(
        source
          .map(
            (product) =>
              product.modelFamily
          )
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(
        b,
        "sv"
      )
    );
  }, [
    products,
    productType,
    brand,
  ]);


  /* ==========================================================
     FILTER STATE
     ========================================================== */

  const isDefaultFilterState =
    query.trim() === "" &&
    productType === "all" &&
    brand === "all" &&
    modelFamily === "all" &&
    inStockOnly &&
    sortBy === "recommended";

  const hasActiveFilters =
    !isDefaultFilterState;


  /* ==========================================================
     FILTERED PRODUCTS
     ========================================================== */

  const filteredProducts = useMemo(() => {
    const normalizedQuery =
      query
        .trim()
        .toLowerCase();

    const isSearching =
      normalizedQuery.length > 0;

    const result =
      products.filter(
        (product) => {
          // Lager
          if (
            inStockOnly &&
            !product.stock
          ) {
            return false;
          }

          // På helt ofiltrerad startsida visas topptelefonerna
          // redan i featured-sektionen, så undvik dubbletter där.
          if (
            isDefaultFilterState &&
            topPhoneIds.has(
              product.id
            )
          ) {
            return false;
          }

          // Produkttyp
          if (
            productType !== "all" &&
            product.productType !==
              productType
          ) {
            return false;
          }

          // Varumärke
          if (
            brand !== "all" &&
            product.brand !== brand
          ) {
            return false;
          }

          // Modellfamilj
          if (
            modelFamily !== "all" &&
            product.modelFamily !==
              modelFamily
          ) {
            return false;
          }

          // Sökning
          if (isSearching) {
            const searchable = [
              product.name,
              product.brand,
              product.modelFamily,
              product.mpn,
              product.gtin,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            if (
              !searchable.includes(
                normalizedQuery
              )
            ) {
              return false;
            }
          }

          return true;
        }
      );

    return result.sort(
      (a, b) => {
        switch (sortBy) {
          case "price-asc":
            return (
              a.price -
              b.price
            );

          case "price-desc":
            return (
              b.price -
              a.price
            );

          case "name-asc":
            return a.name.localeCompare(
              b.name,
              "sv"
            );

          case "recommended":
          default:
            return (
              getProductPriority(b) -
              getProductPriority(a)
            );
        }
      }
    );
  }, [
    products,
    query,
    productType,
    brand,
    modelFamily,
    inStockOnly,
    sortBy,
    topPhoneIds,
    isDefaultFilterState,
  ]);


  /* ==========================================================
     PAGINATION
     ========================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length /
      PRODUCTS_PER_PAGE
    )
  );


  const paginatedProducts = useMemo(() => {
    const start =
      (currentPage - 1) *
      PRODUCTS_PER_PAGE;

    const end =
      start +
      PRODUCTS_PER_PAGE;

    return filteredProducts.slice(
      start,
      end
    );
  }, [
    filteredProducts,
    currentPage,
  ]);


  const pageStart =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) *
          PRODUCTS_PER_PAGE +
        1;

  const pageEnd =
    Math.min(
      currentPage *
        PRODUCTS_PER_PAGE,
      filteredProducts.length
    );


  // När filter eller sortering ändras:
  // gå alltid tillbaka till sida 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [
    query,
    productType,
    brand,
    modelFamily,
    inStockOnly,
    sortBy,
  ]);


  // Om produktmängden ändras, se till att aktuell sida
  // fortfarande finns.
  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);


  const visiblePageNumbers =
    useMemo(() => {
      if (totalPages <= 7) {
        return Array.from(
          {
            length:
              totalPages,
          },
          (_, index) =>
            index + 1
        );
      }

      const pages =
        new Set<number>();

      pages.add(1);
      pages.add(totalPages);

      for (
        let page =
          currentPage - 1;
        page <=
          currentPage + 1;
        page += 1
      ) {
        if (
          page > 1 &&
          page < totalPages
        ) {
          pages.add(page);
        }
      }

      return Array.from(
        pages
      ).sort(
        (a, b) =>
          a - b
      );
    }, [
      currentPage,
      totalPages,
    ]);


  const handlePageChange = (
    page: number
  ) => {
    const nextPage =
      Math.min(
        Math.max(
          page,
          1
        ),
        totalPages
      );

    setCurrentPage(
      nextPage
    );
  };


  /* ==========================================================
     CART
     ========================================================== */

  const totalCartItems = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.qty,
        0
      ),
    [cart]
  );


  /* ==========================================================
     AUTH
     ========================================================== */

  const handleLogin = async (
    id: string
  ) => {
    if (!id.trim()) {
      toast.error(
        "Ange ditt kund-ID."
      );

      return;
    }

    try {
      const result =
        await companyLogin(
          id.trim()
        );

      setAccount(
        result.company
      );

      setCart([]);

      toast.success(
        `Inloggad som ${result.company.name}`
      );

      await fetchProducts();
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Kunde inte logga in."
      );

      throw error;
    }
  };


  const handleLogout = async () => {
    try {
      await companyLogout();

      setAccount(null);
      setCart([]);

      toast.success(
        "Du är utloggad."
      );

      await fetchProducts();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      toast.error(
        "Kunde inte logga ut."
      );
    }
  };


  /* ==========================================================
     CART ACTIONS
     ========================================================== */

  const addToCart = (
    product: Product
  ) => {
    setCart((prev) => {
      const existing =
        prev.find(
          (item) =>
            item.product.id ===
            product.id
        );

      if (existing) {
        return prev.map(
          (item) =>
            item.product.id ===
            product.id
              ? {
                  ...item,
                  qty:
                    item.qty + 1,
                }
              : item
        );
      }

      return [
        ...prev,
        {
          product,
          qty: 1,
        },
      ];
    });

    toast.success(
      `${product.name} lades i varukorgen`
    );
  };


  const clearCart = () => {
    if (
      cart.length === 0
    ) {
      return;
    }

    setCart([]);

    toast.info(
      "Varukorgen har tömts."
    );
  };


  /* ==========================================================
     FILTER ACTIONS
     ========================================================== */

  const resetFilters = () => {
    setQuery("");
    setProductType("all");
    setBrand("all");
    setModelFamily("all");
    setInStockOnly(true);
    setSortBy("recommended");
    setCurrentPage(1);
  };


  const handleProductTypeChange = (
    value: ProductTypeFilter
  ) => {
    setProductType(value);

    // När produkttyp ändras återställs underfiltren
    // så vi inte behåller ett varumärke/modell som
    // inte finns i den nya produktgruppen.
    setBrand("all");
    setModelFamily("all");
    setCurrentPage(1);
  };


  const handleBrandChange = (
    value: string
  ) => {
    setBrand(value);

    // Modellistan beror på valt varumärke.
    setModelFamily("all");
    setCurrentPage(1);
  };


  const handleShowAllPhones = () => {
    setQuery("");
    setProductType("phone");
    setBrand("all");
    setModelFamily("all");
    setInStockOnly(true);
    setSortBy("recommended");
    setCurrentPage(1);

    requestAnimationFrame(() => {
      document
        .getElementById(
          "product-results"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  };


  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-[#171C25]">
      <Navbar />

      <main>
        <ShopHero />

        <section className="py-10 md:py-14 lg:py-16">
          <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8">

            {/* Intro */}
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#7D8794]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0B72FE]" />

                  Företagswebbshop
                </div>

                <h1 className="text-[32px] font-semibold leading-[1] tracking-[-0.045em] text-[#171C25] md:text-[40px]">
                  Utrustning för arbetsdagen.
                </h1>

                <p className="mt-3 max-w-[620px] text-sm leading-6 text-[#667181]">
                  Mobiler, tillbehör och företagsanpassade produkter —
                  samlat på ett ställe.
                </p>
              </div>

              {account && (
                <div className="flex items-center gap-2 rounded-full border border-[#DDE6EC] bg-white px-4 py-2 text-xs text-[#667181]">
                  <span className="h-2 w-2 rounded-full bg-[#2CCEC2]" />

                  Inloggad som

                  <strong className="font-semibold text-[#171C25]">
                    {account.name}
                  </strong>
                </div>
              )}
            </div>


            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">

              {/* Main */}
              <div className="space-y-7 lg:col-span-9">

                {/* Filters */}
                <div
                  className="
                    rounded-[24px]
                    border border-[#E3E9EF]
                    bg-white
                    p-4
                    shadow-[0_12px_40px_rgba(19,31,49,0.04)]
                    sm:p-5
                  "
                >
                  <ProductFilters
                    query={query}
                    onQueryChange={
                      setQuery
                    }

                    productType={
                      productType
                    }
                    onProductTypeChange={
                      handleProductTypeChange
                    }

                    brand={brand}
                    onBrandChange={
                      handleBrandChange
                    }
                    brands={
                      availableBrands
                    }

                    modelFamily={
                      modelFamily
                    }
                    onModelFamilyChange={
                      setModelFamily
                    }
                    models={
                      availableModels
                    }

                    inStockOnly={
                      inStockOnly
                    }
                    onInStockOnlyChange={
                      setInStockOnly
                    }

                    sortBy={sortBy}
                    onSortChange={
                      setSortBy
                    }
                  />
                </div>


                {/* Phone quiz */}
                <PhoneQuiz
                  products={products}
                  onAdd={addToCart}
                  onShowAllPhones={
                    handleShowAllPhones
                  }
                />


                {/* Featured */}
                {isDefaultFilterState &&
                  topSellingPhones.length > 0 && (
                    <section
                      className="
                        relative
                        overflow-hidden
                        rounded-[28px]
                        border border-[#DDE6EC]
                        bg-white
                        p-5
                        shadow-[0_16px_50px_rgba(19,31,49,0.05)]
                        sm:p-6
                      "
                    >
                      <div className="pointer-events-none absolute right-[-130px] top-[-150px] h-[330px] w-[330px] rounded-full bg-[#12B4F0]/10 blur-[100px]" />

                      <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-[13px] bg-gradient-to-br from-[#0B72FE]/10 to-[#2CCEC2]/15">
                            <Flame
                              size={18}
                              strokeWidth={1.8}
                              className="text-[#0B72FE]"
                            />
                          </div>

                          <div>
                            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#8A96A3]">
                              Populärt just nu
                            </div>

                            <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-[#171C25]">
                              Mest sålda telefoner
                            </h2>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleProductTypeChange(
                              "phone"
                            )
                          }
                          className="group inline-flex items-center gap-2 text-sm font-semibold text-[#171C25]"
                        >
                          Visa alla telefoner

                          <span className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </button>
                      </div>

                      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {topSellingPhones.map(
                          (phone) => (
                            <ProductCard
                              key={`featured-${phone.id}`}
                              product={phone}
                              onAdd={addToCart}
                            />
                          )
                        )}
                      </div>
                    </section>
                  )}


                {/* Result header */}
                <div
                  id="product-results"
                  className="flex flex-col gap-3 scroll-mt-6 px-1 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#7D8794]">
                    <span>
                      Visar{" "}

                      <strong className="font-semibold text-[#171C25]">
                        {pageStart}
                        {filteredProducts.length > 0 &&
                          pageStart !== pageEnd
                          ? `–${pageEnd}`
                          : ""}
                      </strong>{" "}

                      av{" "}

                      <strong className="font-semibold text-[#171C25]">
                        {filteredProducts.length}
                      </strong>{" "}

                      produkter

                      {query && (
                        <>
                          {" "}
                          för{" "}

                          <strong className="font-medium text-[#171C25]">
                            “{query}”
                          </strong>
                        </>
                      )}
                    </span>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={
                          resetFilters
                        }
                        className="
                          inline-flex items-center gap-1.5
                          rounded-full
                          border border-[#E3E9EF]
                          bg-white
                          px-3 py-1.5
                          text-xs font-medium
                          text-[#667181]
                          transition
                          hover:border-[#C9D6DF]
                          hover:text-[#171C25]
                        "
                      >
                        <XCircle
                          size={13}
                        />

                        Återställ
                      </button>
                    )}
                  </div>

                  {account?.has_phone_policy && (
                    <div
                      className="
                        inline-flex w-fit items-center gap-2
                        rounded-full
                        border border-[#2CCEC2]/20
                        bg-[#2CCEC2]/10
                        px-3 py-1.5
                        text-xs font-medium
                        text-[#168E85]
                      "
                    >
                      <ShieldCheck
                        size={14}
                      />

                      Företagspolicy aktiv
                    </div>
                  )}
                </div>


                {/* Products */}
                {loadingProducts ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {Array.from({
                      length: 8,
                    }).map((_, i) => (
                      <div
                        key={i}
                        className="
                          rounded-[22px]
                          border border-[#E3E9EF]
                          bg-white
                          p-4
                        "
                      >
                        <div className="aspect-square w-full animate-pulse rounded-[16px] bg-[#EEF2F5]" />

                        <div className="mt-5 h-4 w-3/4 animate-pulse rounded-full bg-[#EEF2F5]" />

                        <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-[#EEF2F5]" />

                        <div className="mt-7 flex items-center justify-between">
                          <div className="h-5 w-20 animate-pulse rounded-full bg-[#EEF2F5]" />

                          <div className="h-9 w-9 animate-pulse rounded-[12px] bg-[#EEF2F5]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                      {paginatedProducts.map(
                        (product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onAdd={addToCart}
                          />
                        )
                      )}
                    </div>


                    {/* Pagination */}
                    {totalPages > 1 && (
                      <nav
                        aria-label="Produktnavigation"
                        className="
                          flex
                          flex-col
                          gap-4
                          rounded-[22px]
                          border
                          border-[#E3E9EF]
                          bg-white
                          px-4
                          py-4
                          shadow-[0_10px_35px_rgba(19,31,49,0.035)]
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >
                        <div className="text-sm text-[#7D8794]">
                          Sida{" "}

                          <strong className="font-semibold text-[#171C25]">
                            {currentPage}
                          </strong>{" "}

                          av{" "}

                          <strong className="font-semibold text-[#171C25]">
                            {totalPages}
                          </strong>
                        </div>


                        <div className="flex flex-wrap items-center gap-2">

                          {/* Previous */}
                          <button
                            type="button"
                            disabled={
                              currentPage === 1
                            }
                            onClick={() =>
                              handlePageChange(
                                currentPage - 1
                              )
                            }
                            className="
                              inline-flex
                              min-h-[40px]
                              items-center
                              justify-center
                              gap-1.5
                              rounded-full
                              border
                              border-[#E3E9EF]
                              bg-white
                              px-3.5
                              text-sm
                              font-medium
                              text-[#667181]
                              transition
                              hover:border-[#CBD6DE]
                              hover:text-[#171C25]
                              disabled:cursor-not-allowed
                              disabled:opacity-40
                            "
                          >
                            <ChevronLeft
                              size={15}
                            />

                            <span className="hidden sm:inline">
                              Föregående
                            </span>
                          </button>


                          {/* Page numbers */}
                          <div className="flex items-center gap-1">
                            {visiblePageNumbers.map(
                              (
                                page,
                                index
                              ) => {
                                const previousPage =
                                  visiblePageNumbers[
                                    index - 1
                                  ];

                                const showGap =
                                  previousPage !==
                                    undefined &&
                                  page -
                                    previousPage >
                                    1;

                                return (
                                  <div
                                    key={
                                      page
                                    }
                                    className="flex items-center gap-1"
                                  >
                                    {showGap && (
                                      <span
                                        aria-hidden="true"
                                        className="px-1 text-sm text-[#9BA6B0]"
                                      >
                                        …
                                      </span>
                                    )}

                                    <button
                                      type="button"
                                      aria-current={
                                        currentPage ===
                                        page
                                          ? "page"
                                          : undefined
                                      }
                                      onClick={() =>
                                        handlePageChange(
                                          page
                                        )
                                      }
                                      className={`
                                        grid
                                        h-10
                                        min-w-10
                                        place-items-center
                                        rounded-full
                                        px-3
                                        text-sm
                                        font-semibold
                                        transition

                                        ${
                                          currentPage ===
                                          page
                                            ? `
                                              bg-[#171C25]
                                              text-white
                                            `
                                            : `
                                              border
                                              border-[#E3E9EF]
                                              bg-white
                                              text-[#667181]
                                              hover:border-[#CBD6DE]
                                              hover:text-[#171C25]
                                            `
                                        }
                                      `}
                                    >
                                      {page}
                                    </button>
                                  </div>
                                );
                              }
                            )}
                          </div>


                          {/* Next */}
                          <button
                            type="button"
                            disabled={
                              currentPage ===
                              totalPages
                            }
                            onClick={() =>
                              handlePageChange(
                                currentPage + 1
                              )
                            }
                            className="
                              inline-flex
                              min-h-[40px]
                              items-center
                              justify-center
                              gap-1.5
                              rounded-full
                              border
                              border-[#E3E9EF]
                              bg-white
                              px-3.5
                              text-sm
                              font-medium
                              text-[#667181]
                              transition
                              hover:border-[#CBD6DE]
                              hover:text-[#171C25]
                              disabled:cursor-not-allowed
                              disabled:opacity-40
                            "
                          >
                            <span className="hidden sm:inline">
                              Nästa
                            </span>

                            <ChevronRight
                              size={15}
                            />
                          </button>
                        </div>
                      </nav>
                    )}
                  </>
                ) : (
                  <div
                    className="
                      flex min-h-[360px] flex-col
                      items-center justify-center
                      rounded-[28px]
                      border border-dashed border-[#D5DEE5]
                      bg-white
                      px-5
                      text-center
                    "
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-[#F4F7FA] text-[#7D8794]">
                      <Sparkles
                        size={22}
                        strokeWidth={1.6}
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold tracking-[-0.025em] text-[#171C25]">
                      Inga produkter hittades
                    </h3>

                    <p className="mt-2 max-w-[420px] text-sm leading-6 text-[#7D8794]">
                      {query
                        ? `Vi hittade inga produkter som matchar “${query}”. Prova ett annat sökord.`
                        : "Det finns inga tillgängliga produkter med de valda filtren just nu."}
                    </p>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={
                          resetFilters
                        }
                        className="
                          mt-6
                          inline-flex
                          min-h-[44px]
                          items-center
                          justify-center
                          rounded-full
                          bg-[#171C25]
                          px-5
                          text-sm
                          font-semibold
                          text-white
                          transition
                          hover:bg-[#2D3444]
                        "
                      >
                        Visa alla produkter
                      </button>
                    )}
                  </div>
                )}
              </div>


              {/* Account + cart */}
              <aside
                id="cart-sidebar"
                className="space-y-5 lg:col-span-3 lg:sticky lg:top-6"
              >
                <AccountCard
                  account={account}
                  loading={loadingAccount}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                  onOpenOrderHistory={() =>
                    setIsOrderHistoryOpen(
                      true
                    )
                  }
                />

                <CartSummary
                  cart={cart}
                  isLoggedIn={
                    Boolean(account)
                  }
                  onClearCart={
                    clearCart
                  }
                  onOpenCheckout={() =>
                    setIsCheckoutOpen(
                      true
                    )
                  }
                />

                <div className="rounded-[20px] border border-[#E3E9EF] bg-white p-5">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck
                      size={17}
                      strokeWidth={1.7}
                      className="text-[#2CCEC2]"
                    />

                    <span className="text-sm font-semibold text-[#171C25]">
                      För företagskunder
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-[#7D8794]">
                    Logga in med ert kund-ID för att se era villkor,
                    företagspolicy och genomföra beställningar.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>


        {/* Mobile cart */}
        {totalCartItems > 0 && (
          <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
            <button
              type="button"
              onClick={() => {
                if (account) {
                  setIsCheckoutOpen(
                    true
                  );
                } else {
                  toast.error(
                    "Logga in med ert kund-ID för att beställa."
                  );
                }
              }}
              className="
                flex
                min-h-[56px]
                w-full
                items-center
                justify-between
                rounded-full
                bg-[#171C25]
                px-5
                text-sm
                font-semibold
                text-white
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                transition
                active:scale-[0.98]
              "
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag
                  size={18}
                />

                <span>
                  Varukorg (
                  {totalCartItems} st)
                </span>
              </div>

              <span className="text-white/60">
                Till kassan →
              </span>
            </button>
          </div>
        )}


        {/* Modals */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() =>
            setIsCheckoutOpen(
              false
            )
          }
          cart={cart}
          allProducts={products}
          account={account}
          onAddToCart={addToCart}
          onOrderSuccess={() => {
            setCart([]);

            setIsCheckoutOpen(
              false
            );
          }}
        />

        <OrderHistoryModal
          isOpen={isOrderHistoryOpen}
          onClose={() =>
            setIsOrderHistoryOpen(
              false
            )
          }
        />
      </main>

      <Footer />
    </div>
  );
}