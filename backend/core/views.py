from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.middleware.csrf import get_token

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Company, Product, Order
from .serializers import (
    CompanySerializer,
    ProductSerializer,
    OrderSerializer,
)


class CsrfTokenView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "csrfToken": get_token(request),
        })


# ============================================================
# ADMIN AUTH
# ============================================================

class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"detail": "Användarnamn och lösenord krävs."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(
            request,
            username=username,
            password=password,
        )

        if user is None:
            return Response(
                {"detail": "Felaktigt användarnamn eller lösenord."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {"detail": "Användarkontot är inaktiverat."},
                status=status.HTTP_403_FORBIDDEN,
            )

        login(request, user)

        return Response(
            {
                "detail": "Inloggning lyckades.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_staff": user.is_staff,
                    "is_superuser": user.is_superuser,
                },
            }
        )


class AdminLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"detail": "Utloggning lyckades."})


class AdminMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
            }
        )


# ============================================================
# COMPANY AUTH
# ============================================================

class CompanyLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        company_code = request.data.get("company_code")

        if not company_code:
            return Response(
                {"detail": "Företagskod krävs."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            company = Company.objects.get(company_code=company_code)
        except Company.DoesNotExist:
            return Response(
                {"detail": "Ogiltig företagskod."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Sätt sessionsdata och spara i session-tabellen
        request.session["company_id"] = company.id
        request.session["company_code"] = company.company_code
        request.session.modified = True
        request.session.save()

        return Response(
            {
                "detail": "Inloggning lyckades.",
                "company": {
                    "id": company.id,
                    "name": company.name,
                    "company_code": company.company_code,
                    "organization_number": company.organization_number,
                    "price_markup": str(company.price_markup),
                    "has_phone_policy": company.has_phone_policy,
                },
            }
        )


class CompanyLogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        request.session.flush()
        return Response({"detail": "Utloggning lyckades."})


class CompanyMeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        company_id = request.session.get("company_id")

        if not company_id:
            return Response(
                {"detail": "Inte inloggad."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        company = get_object_or_404(Company, pk=company_id)
        return Response(CompanySerializer(company).data)


# ============================================================
# ADMIN COMPANIES
# ============================================================

class CompanyListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        companies = Company.objects.prefetch_related("allowed_phones").all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CompanySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        company = serializer.save()
        return Response(
            CompanySerializer(company).data,
            status=status.HTTP_201_CREATED,
        )


class CompanyDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(
            Company.objects.prefetch_related("allowed_phones"),
            pk=pk,
        )

    def get(self, request, pk):
        company = self.get_object(pk)
        return Response(CompanySerializer(company).data)

    def patch(self, request, pk):
        company = self.get_object(pk)
        serializer = CompanySerializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        company = serializer.save()
        return Response(CompanySerializer(company).data)

    def delete(self, request, pk):
        company = self.get_object(pk)
        company.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ============================================================
# PRODUCTS
# ============================================================

class ProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        company_id = request.session.get("company_id")
        products = Product.objects.filter(active=True)

        # 1. Om kunden är inloggad och har en aktiv sortimentspolicy:
        if company_id:
            try:
                company = Company.objects.prefetch_related("allowed_phones").get(pk=company_id)
                if company.has_phone_policy:
                    # Returnera BARA de exakt utvalda artiklarna (inga generella tillbehör släpps igenom)
                    allowed_ids = company.allowed_phones.values_list("id", flat=True)
                    products = products.filter(id__in=allowed_ids)
            except Company.DoesNotExist:
                pass

        # 2. Filtrera på product_type om frontend efterfrågar det (t.ex. ?product_type=phone)
        product_type = request.query_params.get("product_type")
        if product_type:
            products = products.filter(product_type=product_type)

        serializer = ProductSerializer(
            products,
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)


class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk, active=True)
        return Response(
            ProductSerializer(
                product,
                context={"request": request},
            ).data
        )


class CompanyPhonesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        company_id = request.session.get("company_id")

        if not company_id:
            return Response(
                {"detail": "Inte inloggad."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        company = get_object_or_404(Company, pk=company_id)

        if not company.has_phone_policy:
            phones = Product.objects.filter(product_type="phone", active=True)
        else:
            # Hämtar enbart telefonerna bland företagets tillåtna artiklar
            phones = company.allowed_phones.filter(product_type="phone", active=True)

        serializer = ProductSerializer(
            phones,
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)


# ============================================================
# COMPANY ORDERS
# ============================================================

class CompanyOrderListCreateView(APIView):
    permission_classes = [AllowAny]

    def get_company(self, request):
        company_id = request.session.get("company_id")
        if not company_id:
            return None
        return Company.objects.filter(pk=company_id).first()

    def get(self, request):
        company = self.get_company(request)
        if company is None:
            return Response(
                {"detail": "Inte inloggad."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        orders = Order.objects.filter(company=company).prefetch_related("items__product")
        serializer = OrderSerializer(
            orders,
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        company = self.get_company(request)
        if company is None:
            return Response(
                {"detail": "Inte inloggad."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = OrderSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        return Response(
            OrderSerializer(
                order,
                context={"request": request},
            ).data,
            status=status.HTTP_201_CREATED,
        )


class CompanyOrderDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        company_id = request.session.get("company_id")
        if not company_id:
            return Response(
                {"detail": "Inte inloggad."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        order = get_object_or_404(
            Order.objects.prefetch_related("items__product"),
            pk=pk,
            company_id=company_id,
        )

        return Response(
            OrderSerializer(
                order,
                context={"request": request},
            ).data
        )