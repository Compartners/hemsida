# core/emails.py

from decimal import Decimal

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils import timezone


def send_order_notification_email(order):
    """
    Skickar:
    1. Ett internt ordernotifieringsmail till ComPartners.
    2. En orderbekräftelse till företagets registrerade e-postadress.

    Om företaget saknar e-post skickas endast det interna mailet.
    """

    # ---------------------------------------------------------
    # Grunduppgifter
    # ---------------------------------------------------------

    internal_recipient = getattr(
        settings,
        "ORDER_NOTIFICATION_EMAIL",
        settings.DEFAULT_FROM_EMAIL,
    )

    company = order.company
    company_name = company.name if company else "Direktkund"
    company_email = company.email if company and company.email else None

    company_code = (
        company.company_code
        if company
        else "-"
    )

    order_date = (
        order.created_at.strftime("%Y-%m-%d %H:%M")
        if hasattr(order, "created_at") and order.created_at
        else timezone.now().strftime("%Y-%m-%d %H:%M")
    )

    # ---------------------------------------------------------
    # Hämta orderrader
    # ---------------------------------------------------------

    items = order.items.select_related("product").all()

    total_amount = Decimal("0.00")

    item_rows_html = ""
    item_rows_text = ""

    for item in items:
        line_total = item.unit_price * item.quantity
        total_amount += line_total

        p_name = (
            item.product.name
            if item.product
            else "Okänd artikel"
        )

        art_nr = (
            item.product.mpn
            if item.product and item.product.mpn
            else "-"
        )

        # Textversion
        item_rows_text += (
            f"- {item.quantity} st x {p_name} "
            f"(Art: {art_nr}) — "
            f"{item.unit_price:,.2f} SEK/st "
            f"(Totalt: {line_total:,.2f} SEK)\n"
        )

        # HTML-version
        item_rows_html += f"""
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 12px; font-weight: 500; color: #111827;">
                {p_name}<br>
                <span style="font-size: 11px; color: #6b7280;">
                    Art.nr: {art_nr}
                </span>
            </td>

            <td style="padding: 10px 12px; text-align: center; color: #374151;">
                {item.quantity}
            </td>

            <td style="padding: 10px 12px; text-align: right; color: #374151;">
                {item.unit_price:,.2f} SEK
            </td>

            <td style="padding: 10px 12px; text-align: right; font-weight: 600; color: #111827;">
                {line_total:,.2f} SEK
            </td>
        </tr>
        """

    # ---------------------------------------------------------
    # Summering
    # ---------------------------------------------------------

    vat_amount = total_amount * Decimal("0.25")
    total_with_vat = total_amount * Decimal("1.25")

    # ---------------------------------------------------------
    # 1. INTERNT ORDERMAIL
    # ---------------------------------------------------------

    internal_subject = (
        f"Ny beställning #{order.id} — {company_name}"
    )

    internal_text_content = f"""
NY BESTÄLLNING MOTTAGEN #{order.id}
=======================================

Företag: {company_name}
Kund-ID: {company_code}
Org.nummer: {order.organization_number or '-'}
Beställare / Referens: {order.ordered_by}
Kundens e-post: {company_email or '-'}
Datum: {order_date}
Märkning/Kommentar: {order.comment or 'Ingen'}

BESTÄLLDA ARTIKLAR:
---------------------------------------
{item_rows_text}

SUMMERING:
Totalt exkl. moms: {total_amount:,.2f} SEK
Moms (25%): {vat_amount:,.2f} SEK
Totalt inkl. moms: {total_with_vat:,.2f} SEK

=======================================
Detta är en automatisk orderavisering från ComPartners Webbshop.
""".strip()

    internal_html_content = f"""
    <!DOCTYPE html>
    <html>
    <body style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Helvetica, Arial, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 24px;
    ">

        <div style="
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
        ">

            <!-- Header -->
            <div style="
                background-color: #0f172a;
                color: #ffffff;
                padding: 24px;
            ">
                <h1 style="
                    margin: 0;
                    font-size: 20px;
                    font-weight: 700;
                ">
                    Ny webborder #{order.id}
                </h1>

                <p style="
                    margin: 4px 0 0 0;
                    font-size: 13px;
                    color: #94a3b8;
                ">
                    Mottagen {order_date}
                </p>
            </div>

            <div style="padding: 24px;">

                <!-- Kunduppgifter -->
                <div style="
                    background-color: #f8fafc;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 24px;
                    border: 1px solid #e2e8f0;
                ">

                    <h2 style="
                        margin: 0 0 12px 0;
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        color: #64748b;
                    ">
                        Kundinformation
                    </h2>

                    <table style="
                        width: 100%;
                        font-size: 13px;
                        line-height: 1.6;
                        color: #334155;
                    ">
                        <tr>
                            <td style="width: 140px; color: #64748b;">
                                Företag:
                            </td>
                            <td>
                                <strong>{company_name}</strong>
                            </td>
                        </tr>

                        <tr>
                            <td style="color: #64748b;">
                                Kund-ID:
                            </td>
                            <td>
                                {company_code}
                            </td>
                        </tr>

                        <tr>
                            <td style="color: #64748b;">
                                Org.nummer:
                            </td>
                            <td>
                                {order.organization_number or '-'}
                            </td>
                        </tr>

                        <tr>
                            <td style="color: #64748b;">
                                Beställare:
                            </td>
                            <td>
                                <strong>{order.ordered_by}</strong>
                            </td>
                        </tr>

                        <tr>
                            <td style="color: #64748b;">
                                E-post:
                            </td>
                            <td>
                                {company_email or '-'}
                            </td>
                        </tr>

                        {
                            f'''
                            <tr>
                                <td style="color: #64748b;">
                                    Märkning/Notering:
                                </td>
                                <td>
                                    {order.comment}
                                </td>
                            </tr>
                            '''
                            if order.comment
                            else ''
                        }
                    </table>
                </div>

                <!-- Artiklar -->
                <h2 style="
                    margin: 0 0 12px 0;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #64748b;
                ">
                    Artiklar
                </h2>

                <table style="
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 13px;
                    margin-bottom: 20px;
                ">
                    <thead>
                        <tr style="
                            background-color: #f8fafc;
                            border-bottom: 2px solid #e2e8f0;
                            color: #64748b;
                            font-size: 11px;
                            text-transform: uppercase;
                        ">
                            <th style="padding: 8px 12px; text-align: left;">
                                Produkt
                            </th>

                            <th style="padding: 8px 12px; text-align: center;">
                                Antal
                            </th>

                            <th style="padding: 8px 12px; text-align: right;">
                                À-pris
                            </th>

                            <th style="padding: 8px 12px; text-align: right;">
                                Summa
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {item_rows_html}
                    </tbody>
                </table>

                <!-- Totaler -->
                <div style="
                    border-top: 2px solid #e2e8f0;
                    padding-top: 16px;
                    text-align: right;
                    font-size: 14px;
                    line-height: 1.6;
                ">

                    <div>
                        <span style="color: #64748b;">
                            Totalt exkl. moms:
                        </span>

                        <strong>
                            {total_amount:,.2f} SEK
                        </strong>
                    </div>

                    <div style="
                        font-size: 12px;
                        color: #64748b;
                    ">
                        Moms (25%): {vat_amount:,.2f} SEK
                    </div>

                    <div style="
                        margin-top: 6px;
                        font-size: 16px;
                        font-weight: 700;
                        color: #0f172a;
                    ">
                        Totalt inkl. moms:
                        {total_with_vat:,.2f} SEK
                    </div>

                </div>
            </div>

            <!-- Footer -->
            <div style="
                background-color: #f8fafc;
                border-top: 1px solid #e2e8f0;
                padding: 16px;
                text-align: center;
                font-size: 12px;
                color: #94a3b8;
            ">
                Detta är en automatisk orderavisering från
                ComPartners Webbshop.
            </div>

        </div>
    </body>
    </html>
    """

    internal_email = EmailMultiAlternatives(
        subject=internal_subject,
        body=internal_text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[internal_recipient],
    )

    internal_email.attach_alternative(
        internal_html_content,
        "text/html",
    )

    internal_email.send(fail_silently=False)

    # ---------------------------------------------------------
    # 2. KUNDENS ORDERBEKRÄFTELSE
    # ---------------------------------------------------------

    if company_email:

        customer_subject = (
            f"Orderbekräftelse #{order.id} — {company_name}"
        )

        customer_text_content = f"""
TACK FÖR DIN BESTÄLLNING!

Vi har mottagit er beställning #{order.id}.

Företag: {company_name}
Beställare: {order.ordered_by}
Datum: {order_date}

BESTÄLLDA ARTIKLAR:
---------------------------------------
{item_rows_text}

SUMMERING:
Totalt exkl. moms: {total_amount:,.2f} SEK
Moms (25%): {vat_amount:,.2f} SEK
Totalt inkl. moms: {total_with_vat:,.2f} SEK

Vi återkommer när ordern har behandlats.

Tack för er beställning!

ComPartners
ComPartners Webbshop
""".strip()

        customer_html_content = f"""
        <!DOCTYPE html>
        <html>
        <body style="
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Helvetica, Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 24px;
        ">

            <div style="
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                border: 1px solid #e5e7eb;
            ">

                <!-- Header -->
                <div style="
                    background-color: #0f172a;
                    color: #ffffff;
                    padding: 28px 24px;
                ">

                    <h1 style="
                        margin: 0;
                        font-size: 22px;
                        font-weight: 700;
                    ">
                        Tack för din beställning!
                    </h1>

                    <p style="
                        margin: 8px 0 0 0;
                        font-size: 14px;
                        color: #cbd5e1;
                    ">
                        Vi har mottagit er order #{order.id}.
                    </p>

                </div>

                <div style="padding: 24px;">

                    <!-- Orderinformation -->
                    <div style="
                        background-color: #f8fafc;
                        border-radius: 12px;
                        padding: 16px;
                        margin-bottom: 24px;
                        border: 1px solid #e2e8f0;
                    ">

                        <table style="
                            width: 100%;
                            font-size: 13px;
                            line-height: 1.7;
                            color: #334155;
                        ">

                            <tr>
                                <td style="
                                    width: 140px;
                                    color: #64748b;
                                ">
                                    Ordernummer:
                                </td>

                                <td>
                                    <strong>#{order.id}</strong>
                                </td>
                            </tr>

                            <tr>
                                <td style="color: #64748b;">
                                    Företag:
                                </td>

                                <td>
                                    <strong>{company_name}</strong>
                                </td>
                            </tr>

                            <tr>
                                <td style="color: #64748b;">
                                    Beställare:
                                </td>

                                <td>
                                    {order.ordered_by}
                                </td>
                            </tr>

                            <tr>
                                <td style="color: #64748b;">
                                    Datum:
                                </td>

                                <td>
                                    {order_date}
                                </td>
                            </tr>

                        </table>
                    </div>

                    <!-- Artiklar -->
                    <h2 style="
                        margin: 0 0 12px 0;
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        color: #64748b;
                    ">
                        Din beställning
                    </h2>

                    <table style="
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 13px;
                        margin-bottom: 20px;
                    ">

                        <thead>
                            <tr style="
                                background-color: #f8fafc;
                                border-bottom: 2px solid #e2e8f0;
                                color: #64748b;
                                font-size: 11px;
                                text-transform: uppercase;
                            ">

                                <th style="
                                    padding: 8px 12px;
                                    text-align: left;
                                ">
                                    Produkt
                                </th>

                                <th style="
                                    padding: 8px 12px;
                                    text-align: center;
                                ">
                                    Antal
                                </th>

                                <th style="
                                    padding: 8px 12px;
                                    text-align: right;
                                ">
                                    À-pris
                                </th>

                                <th style="
                                    padding: 8px 12px;
                                    text-align: right;
                                ">
                                    Summa
                                </th>

                            </tr>
                        </thead>

                        <tbody>
                            {item_rows_html}
                        </tbody>

                    </table>

                    <!-- Totaler -->
                    <div style="
                        border-top: 2px solid #e2e8f0;
                        padding-top: 16px;
                        text-align: right;
                        font-size: 14px;
                        line-height: 1.6;
                    ">

                        <div>
                            <span style="color: #64748b;">
                                Totalt exkl. moms:
                            </span>

                            <strong>
                                {total_amount:,.2f} SEK
                            </strong>
                        </div>

                        <div style="
                            font-size: 12px;
                            color: #64748b;
                        ">
                            Moms (25%):
                            {vat_amount:,.2f} SEK
                        </div>

                        <div style="
                            margin-top: 6px;
                            font-size: 17px;
                            font-weight: 700;
                            color: #0f172a;
                        ">
                            Totalt inkl. moms:
                            {total_with_vat:,.2f} SEK
                        </div>

                    </div>

                    <!-- Status -->
                    <div style="
                        margin-top: 28px;
                        padding: 16px;
                        background-color: #f8fafc;
                        border-radius: 12px;
                        border: 1px solid #e2e8f0;
                        font-size: 13px;
                        line-height: 1.6;
                        color: #475569;
                    ">

                        <strong style="color: #0f172a;">
                            Vad händer nu?
                        </strong>

                        <br>

                        Vi behandlar er beställning och återkommer
                        när ordern har gått vidare.

                    </div>

                </div>

                <!-- Footer -->
                <div style="
                    background-color: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                    padding: 18px;
                    text-align: center;
                    font-size: 12px;
                    color: #94a3b8;
                ">
                    ComPartners Webbshop
                    <br>
                    Detta är ett automatiskt orderbekräftelsemail.
                </div>

            </div>

        </body>
        </html>
        """

        customer_email = EmailMultiAlternatives(
            subject=customer_subject,
            body=customer_text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[company_email],
            reply_to=[company_email],
        )

        customer_email.attach_alternative(
            customer_html_content,
            "text/html",
        )

        customer_email.send(fail_silently=False)