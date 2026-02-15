#!/usr/bin/env python3
"""
Dust Bunnies Cleaning — Quote Template Generator
Generates:
  1. A branded PDF quote for email delivery
  2. A clean image quote for Messenger/Instagram
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, Color
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import Table, TableStyle
from PIL import Image, ImageDraw, ImageFont
import os

# ─── Brand Colours ────────────────────────────────────────
PRIMARY = HexColor("#4A9E7E")
PRIMARY_DARK = HexColor("#2D7A5E")
PRIMARY_LIGHT = HexColor("#E8F5EE")
SIDEBAR = HexColor("#1B3A2D")
BLUE = HexColor("#5B9EC4")
ACCENT = HexColor("#E8C86A")
TEXT = HexColor("#2C3E36")
TEXT_MUTED = HexColor("#7A8F85")
TEXT_LIGHT = HexColor("#A3B5AD")
BG = HexColor("#F4F8F6")
BORDER = HexColor("#E2EBE6")

# ─── Sample Quote Data ────────────────────────────────────
QUOTE_DATA = {
    "quote_number": "DB-2026-0042",
    "date": "14 February 2026",
    "valid_until": "28 February 2026",
    "customer": {
        "name": "Sarah Mitchell",
        "email": "sarah.m@email.com",
        "phone": "0412 345 678",
        "suburb": "Buderim",
    },
    "frequency": "Fortnightly",
    "items": [
        {"description": "Bedroom cleaning", "qty": 3, "unit_price": 25.00, "total": 75.00},
        {"description": "Bathroom cleaning", "qty": 2, "unit_price": 35.00, "total": 70.00},
        {"description": "Living room cleaning", "qty": 1, "unit_price": 25.00, "total": 25.00},
        {"description": "Kitchen cleaning", "qty": 1, "unit_price": 50.00, "total": 50.00},
        {"description": "Oven deep clean", "qty": 1, "unit_price": 65.00, "total": 65.00},
    ],
    "subtotal": 285.00,
    "discount_label": None,
    "discount_amount": 0,
    "total": 285.00,
}

# Also generate a weekly example
QUOTE_DATA_WEEKLY = {
    "quote_number": "DB-2026-0043",
    "date": "14 February 2026",
    "valid_until": "28 February 2026",
    "customer": {
        "name": "Priya Sharma",
        "email": "priya.s@email.com",
        "phone": "0434 567 890",
        "suburb": "Maroochydore",
    },
    "frequency": "Weekly",
    "items": [
        {"description": "Bedroom cleaning", "qty": 2, "unit_price": 25.00, "total": 50.00},
        {"description": "Bathroom cleaning", "qty": 1, "unit_price": 35.00, "total": 35.00},
        {"description": "Living room cleaning", "qty": 1, "unit_price": 25.00, "total": 25.00},
        {"description": "Kitchen cleaning", "qty": 1, "unit_price": 50.00, "total": 50.00},
        {"description": "Window cleaning", "qty": 6, "unit_price": 5.00, "total": 30.00},
    ],
    "subtotal": 190.00,
    "discount_label": "Weekly Clean Discount (10%)",
    "discount_amount": 19.00,
    "total": 171.00,
}


def draw_rounded_rect(c, x, y, w, h, r, fill=None, stroke=None, stroke_width=0.5):
    """Draw a rounded rectangle on a reportlab canvas."""
    p = c.beginPath()
    p.moveTo(x + r, y)
    p.lineTo(x + w - r, y)
    p.arcTo(x + w - r, y, x + w, y + r, 0)
    p.lineTo(x + w, y + h - r)
    p.arcTo(x + w, y + h - r, x + w - r, y + h, 0)
    p.lineTo(x + r, y + h)
    p.arcTo(x + r, y + h, x, y + h - r, 0)
    p.lineTo(x, y + r)
    p.arcTo(x, y + r, x + r, y, 0)
    p.close()
    if fill:
        c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(stroke_width)
    if fill and stroke:
        c.drawPath(p, fill=1, stroke=1)
    elif fill:
        c.drawPath(p, fill=1, stroke=0)
    elif stroke:
        c.drawPath(p, fill=0, stroke=1)


def generate_pdf_quote(data, filename):
    """Generate a beautiful branded PDF quote."""
    w, h = A4
    c = canvas.Canvas(filename, pagesize=A4)
    margin = 25 * mm

    # ─── Background ───
    c.setFillColor(BG)
    c.rect(0, 0, w, h, fill=1, stroke=0)

    # ─── Header Bar ───
    c.setFillColor(SIDEBAR)
    c.rect(0, h - 100, w, 100, fill=1, stroke=0)

    # Logo area
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(margin, h - 45, "Dust Bunnies Cleaning")
    c.setFont("Helvetica", 10)
    c.setFillColor(HexColor("#8FBFA8"))
    c.drawString(margin, h - 62, "Eco-conscious cleaning  |  Sunshine Coast, QLD")

    # Leaf emoji placeholder
    c.setFillColor(PRIMARY)
    c.circle(w - margin - 20, h - 50, 18, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(w - margin - 20, h - 56, "DB")

    # ─── Quote Title Bar ───
    y = h - 130
    c.setFillColor(PRIMARY)
    c.rect(0, y, w, 30, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(margin, y + 9, "CLEANING QUOTE")
    c.setFont("Helvetica", 10)
    c.drawRightString(w - margin, y + 9, f"#{data['quote_number']}")

    # ─── Quote Details + Customer Info ───
    y -= 30

    # Left: Quote details
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawString(margin, y, "QUOTE DATE")
    c.drawString(margin + 100, y, "VALID UNTIL")
    c.drawString(margin + 200, y, "FREQUENCY")
    y -= 16
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(TEXT)
    c.drawString(margin, y, data["date"])
    c.drawString(margin + 100, y, data["valid_until"])

    # Frequency with highlight
    freq_x = margin + 200
    freq_text = data["frequency"]
    if data["frequency"] == "Weekly":
        # Draw highlight badge
        draw_rounded_rect(c, freq_x - 4, y - 3, 115, 18, 4, fill=PRIMARY_LIGHT)
        c.setFillColor(PRIMARY_DARK)
        c.drawString(freq_x, y, f"{freq_text} (Save 10%!)")
    else:
        c.drawString(freq_x, y, freq_text)

    # Right: Customer
    rx = w - margin
    y_cust = y + 16
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawRightString(rx, y_cust, "PREPARED FOR")
    y_cust -= 16
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(TEXT)
    c.drawRightString(rx, y_cust, data["customer"]["name"])
    y_cust -= 14
    c.setFont("Helvetica", 9)
    c.setFillColor(TEXT_MUTED)
    c.drawRightString(rx, y_cust, data["customer"]["suburb"] + ", Sunshine Coast")
    y_cust -= 12
    c.drawRightString(rx, y_cust, data["customer"]["email"])

    # ─── Line Items Table ───
    y -= 45

    # Table header
    draw_rounded_rect(c, margin, y - 4, w - 2 * margin, 22, 4, fill=SIDEBAR)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(margin + 12, y + 2, "SERVICE")
    c.drawCentredString(margin + 300, y + 2, "QTY")
    c.drawCentredString(margin + 370, y + 2, "UNIT PRICE")
    c.drawRightString(w - margin - 12, y + 2, "TOTAL")

    y -= 26

    # Table rows
    for i, item in enumerate(data["items"]):
        bg = white if i % 2 == 0 else BG
        draw_rounded_rect(c, margin, y - 6, w - 2 * margin, 24, 2, fill=bg)

        c.setFillColor(TEXT)
        c.setFont("Helvetica", 10)
        c.drawString(margin + 12, y, item["description"])

        c.setFillColor(TEXT_MUTED)
        c.setFont("Helvetica", 10)
        c.drawCentredString(margin + 300, y, str(item["qty"]))
        c.drawCentredString(margin + 370, y, f"${item['unit_price']:.2f}")

        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 10)
        c.drawRightString(w - margin - 12, y, f"${item['total']:.2f}")

        y -= 26

    # ─── Totals ───
    y -= 10

    # Divider
    c.setStrokeColor(BORDER)
    c.setLineWidth(1)
    c.line(w - margin - 200, y + 8, w - margin, y + 8)

    # Subtotal
    c.setFillColor(TEXT_MUTED)
    c.setFont("Helvetica", 10)
    c.drawString(w - margin - 200, y - 8, "Subtotal")
    c.setFillColor(TEXT)
    c.setFont("Helvetica", 10)
    c.drawRightString(w - margin - 12, y - 8, f"${data['subtotal']:.2f}")

    # Discount if applicable
    if data.get("discount_label"):
        y -= 20
        c.setFillColor(PRIMARY_DARK)
        c.setFont("Helvetica", 10)
        c.drawString(w - margin - 200, y - 8, data["discount_label"])
        c.setFont("Helvetica-Bold", 10)
        c.drawRightString(w - margin - 12, y - 8, f"-${data['discount_amount']:.2f}")

    # Total
    y -= 30
    draw_rounded_rect(c, w - margin - 210, y - 14, 222, 36, 6, fill=PRIMARY)
    c.setFillColor(white)
    c.setFont("Helvetica", 11)
    c.drawString(w - margin - 198, y - 4, "TOTAL PER CLEAN")
    c.setFont("Helvetica-Bold", 16)
    c.drawRightString(w - margin - 4, y - 6, f"${data['total']:.2f}")

    # ─── Footer Note ───
    y -= 60
    draw_rounded_rect(c, margin, y - 40, w - 2 * margin, 55, 8, fill=PRIMARY_LIGHT, stroke=PRIMARY, stroke_width=0.5)
    c.setFillColor(PRIMARY_DARK)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(margin + 14, y, "How to accept this quote:")
    c.setFont("Helvetica", 9)
    c.setFillColor(TEXT_MUTED)
    c.drawString(margin + 14, y - 14, "Simply reply to this email or message us and we'll get you booked in!")
    c.drawString(margin + 14, y - 28, "If you have any questions at all, we're always happy to chat.")

    # ─── Bottom Footer ───
    y_footer = 45
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(margin, y_footer, w - margin, y_footer)

    c.setFillColor(TEXT_LIGHT)
    c.setFont("Helvetica", 8)
    c.drawString(margin, y_footer - 15, "Dust Bunnies Cleaning  |  Sunshine Coast, QLD  |  dustbunzcleaning@gmail.com")
    c.drawRightString(w - margin, y_footer - 15, "ABN: XX XXX XXX XXX")
    c.drawCentredString(w / 2, y_footer - 28, "Eco-conscious  •  Sustainable products  •  Local Sunshine Coast business")

    c.save()
    print(f"PDF generated: {filename}")


def generate_image_quote(data, filename):
    """Generate a clean image quote for Messenger/Instagram."""
    W, H = 1080, 1350
    img = Image.new("RGB", (W, H), "#F4F8F6")
    draw = ImageDraw.Draw(img)

    # Load fonts (use default if custom not available)
    try:
        font_bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
        font_reg = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        font_sm = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
        font_xs = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 42)
        font_total = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 56)
        font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
    except:
        font_bold = font_reg = font_sm = font_xs = font_title = font_total = font_label = ImageFont.load_default()

    pad = 60
    primary_rgb = (74, 158, 126)
    primary_dark_rgb = (45, 122, 94)
    sidebar_rgb = (27, 58, 45)
    text_rgb = (44, 62, 54)
    text_muted_rgb = (122, 143, 133)
    text_light_rgb = (163, 181, 173)
    accent_rgb = (232, 200, 106)
    white_rgb = (255, 255, 255)
    bg_rgb = (244, 248, 246)
    border_rgb = (226, 235, 230)

    # ─── Header ───
    draw.rectangle([(0, 0), (W, 180)], fill=sidebar_rgb)

    # Logo text
    draw.text((pad, 50), "Dust Bunnies Cleaning", font=font_title, fill=white_rgb)
    draw.text((pad, 105), "Eco-conscious cleaning  |  Sunshine Coast", font=font_sm, fill=(143, 191, 168))

    # ─── Quote Badge ───
    draw.rectangle([(0, 180), (W, 225)], fill=primary_rgb)
    draw.text((pad, 190), "CLEANING QUOTE", font=font_label, fill=white_rgb)
    draw.text((W - pad - 180, 190), f"#{data['quote_number']}", font=font_label, fill=(200, 235, 215))

    # ─── Customer & Details ───
    y = 250
    draw.text((pad, y), "PREPARED FOR", font=font_label, fill=text_muted_rgb)
    y += 24
    draw.text((pad, y), data["customer"]["name"], font=font_bold, fill=text_rgb)
    y += 40
    draw.text((pad, y), f"{data['customer']['suburb']}, Sunshine Coast", font=font_sm, fill=text_muted_rgb)
    y += 30

    # Frequency
    draw.text((pad, y), f"Frequency: ", font=font_sm, fill=text_muted_rgb)
    freq_x = pad + 140
    if data["frequency"] == "Weekly":
        draw.rounded_rectangle([(freq_x - 8, y - 4), (freq_x + 240, y + 30)], radius=6, fill=(232, 245, 238))
        draw.text((freq_x, y), f"{data['frequency']} (Save 10%!)", font=font_sm, fill=primary_dark_rgb)
    else:
        draw.text((freq_x, y), data["frequency"], font=font_sm, fill=text_rgb)

    # ─── Divider ───
    y += 55
    draw.line([(pad, y), (W - pad, y)], fill=border_rgb, width=2)
    y += 20

    # ─── Line Items ───
    # Header row
    draw.rounded_rectangle([(pad, y), (W - pad, y + 42)], radius=8, fill=sidebar_rgb)
    draw.text((pad + 16, y + 10), "SERVICE", font=font_label, fill=white_rgb)
    draw.text((W - pad - 260, y + 10), "QTY", font=font_label, fill=white_rgb)
    draw.text((W - pad - 160, y + 10), "UNIT", font=font_label, fill=white_rgb)
    draw.text((W - pad - 70, y + 10), "TOTAL", font=font_label, fill=white_rgb)
    y += 50

    for i, item in enumerate(data["items"]):
        row_bg = white_rgb if i % 2 == 0 else bg_rgb
        draw.rounded_rectangle([(pad, y), (W - pad, y + 40)], radius=4, fill=row_bg)
        draw.text((pad + 16, y + 8), item["description"], font=font_sm, fill=text_rgb)
        draw.text((W - pad - 250, y + 8), str(item["qty"]), font=font_sm, fill=text_muted_rgb)
        draw.text((W - pad - 165, y + 8), f"${item['unit_price']:.0f}", font=font_sm, fill=text_muted_rgb)
        draw.text((W - pad - 80, y + 8), f"${item['total']:.0f}", font=font_bold if False else font_sm, fill=text_rgb)
        y += 44

    # ─── Totals ───
    y += 15
    draw.line([(W - pad - 280, y), (W - pad, y)], fill=border_rgb, width=2)
    y += 15

    # Subtotal
    draw.text((W - pad - 280, y), "Subtotal", font=font_sm, fill=text_muted_rgb)
    draw.text((W - pad - 80, y), f"${data['subtotal']:.2f}", font=font_sm, fill=text_rgb)
    y += 35

    # Discount
    if data.get("discount_label"):
        draw.text((W - pad - 280, y), data["discount_label"], font=font_xs, fill=primary_dark_rgb)
        draw.text((W - pad - 90, y), f"-${data['discount_amount']:.2f}", font=font_sm, fill=primary_dark_rgb)
        y += 35

    # Total box
    y += 5
    draw.rounded_rectangle([(pad, y), (W - pad, y + 90)], radius=14, fill=primary_rgb)
    draw.text((pad + 24, y + 12), "TOTAL PER CLEAN", font=font_label, fill=(200, 235, 215))
    draw.text((pad + 24, y + 35), f"${data['total']:.2f}", font=font_total, fill=white_rgb)
    draw.text((W - pad - 180, y + 55), f"per {data['frequency'].lower()} clean", font=font_sm, fill=(200, 235, 215))
    y += 110

    # ─── CTA ───
    y += 10
    draw.rounded_rectangle([(pad, y), (W - pad, y + 65)], radius=10, fill=(232, 245, 238))
    draw.text((pad + 16, y + 10), "To accept, just reply to this message!", font=font_sm, fill=primary_dark_rgb)
    draw.text((pad + 16, y + 38), "We're happy to answer any questions.", font=font_xs, fill=text_muted_rgb)

    # ─── Footer ───
    y = H - 60
    draw.line([(pad, y), (W - pad, y)], fill=border_rgb, width=1)
    draw.text((pad, y + 15), "Dust Bunnies Cleaning  |  Sunshine Coast  |  Eco-conscious", font=font_xs, fill=text_light_rgb)

    img.save(filename, quality=95)
    print(f"Image generated: {filename}")


if __name__ == "__main__":
    out_dir = "/home/claude"

    # Generate PDF quotes
    generate_pdf_quote(QUOTE_DATA, os.path.join(out_dir, "quote-email-sample.pdf"))
    generate_pdf_quote(QUOTE_DATA_WEEKLY, os.path.join(out_dir, "quote-email-weekly-sample.pdf"))

    # Generate image quotes
    generate_image_quote(QUOTE_DATA, os.path.join(out_dir, "quote-social-sample.png"))
    generate_image_quote(QUOTE_DATA_WEEKLY, os.path.join(out_dir, "quote-social-weekly-sample.png"))

    print("\nAll quote templates generated!")
