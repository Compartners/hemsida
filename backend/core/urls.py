from django.urls import path

from .views import (
    CsrfTokenView,
    AdminLoginView,
    AdminLogoutView,
    AdminMeView,
    CompanyLoginView,
    CompanyLogoutView,
    CompanyMeView,
    CompanyListCreateView,
    CompanyDetailView,
    ProductListView,
    ProductDetailView,
    CompanyPhonesView,
    CompanyOrderListCreateView,
    CompanyOrderDetailView,
)


urlpatterns = [
    # Admin authentication
    path(
        "auth/csrf/",
        CsrfTokenView.as_view(),
        name="csrf-token",
    ),

    path(
        "auth/login/",
        AdminLoginView.as_view(),
        name="admin-login",
    ),
    path(
        "auth/logout/",
        AdminLogoutView.as_view(),
        name="admin-logout",
    ),
    path(
        "auth/me/",
        AdminMeView.as_view(),
        name="admin-me",
    ),

    # Company authentication
    path(
        "company/login/",
        CompanyLoginView.as_view(),
        name="company-login",
    ),
    path(
        "company/logout/",
        CompanyLogoutView.as_view(),
        name="company-logout",
    ),
    path(
        "company/me/",
        CompanyMeView.as_view(),
        name="company-me",
    ),

    # Admin company management
    path(
        "companies/",
        CompanyListCreateView.as_view(),
        name="company-list-create",
    ),
    path(
        "companies/<int:pk>/",
        CompanyDetailView.as_view(),
        name="company-detail",
    ),

    # Products
    path(
        "products/",
        ProductListView.as_view(),
        name="product-list",
    ),
    path(
        "products/<int:pk>/",
        ProductDetailView.as_view(),
        name="product-detail",
    ),

    # Logged-in company
    path(
        "company/phones/",
        CompanyPhonesView.as_view(),
        name="company-phones",
    ),
    path(
        "company/orders/",
        CompanyOrderListCreateView.as_view(),
        name="company-orders",
    ),
    path(
        "company/orders/<int:pk>/",
        CompanyOrderDetailView.as_view(),
        name="company-order-detail",
    ),
]