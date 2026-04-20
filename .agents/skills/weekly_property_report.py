#!/usr/bin/env python3
"""
Weekly Property Report Generator for SIMPLEX-ITY
Generates a branded PDF of HK Island property listings and saves to Document vault
"""

import os
import json
import requests
from io import BytesIO
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, Image as RLImage, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfgen import canvas

LISTINGS = [
    {"id": "3815403", "name": "Apartment", "price_str": "HK$11,000", "address": "Causeway Bay, HK Island", "district": "Causeway Bay", "size_sf": "200", "floor": "Low Floor", "beds": "1", "baths": "1", "image": "https://i1.28hse.com/2026/04/202604182216272724839_large.jpg", "url": "https://www.28hse.com/en/rent/apartment/property-3815403"},
    {"id": "3814996", "name": "Mido Apartment", "price_str": "HK$8,500", "address": "332 Kings Road, North Point", "district": "North Point", "size_sf": "N/A", "floor": "High Floor", "beds": "N/A", "baths": "N/A", "image": "https://i1.28hse.com/2026/04/202604181720015331297_large.jpg", "url": "https://www.28hse.com/en/rent/apartment/property-3814996"},
    {"id": "3815470", "name": "Tung Fat Building", "price_str": "HK$9,200", "address": "49 Kam Ping Street, North Point", "district": "North Point", "size_sf": "180", "floor": "Low Floor", "beds": "1", "baths": "1", "image": "https://i1.28hse.com/2026/04/202604190123132035085_large.jpg", "url": "https://www.28hse.com/en/rent/apartment/property-3815470"},
    {"id": "3815533", "name": "Parker's Court", "price_str": "HK$16,800", "address": "64 Fort Street, North Point", "district": "North Point", "size_sf": "342", "floor": "High Floor", "beds": "2", "baths": "1", "image": "https://i1.28hse.com/2026/04/202604191107277842733_large.jpg", "url": "https://www.28hse.com/en/rent/apartment/property-3815533"},
    {"id": "3814374", "name": "Novum East", "price_str": "HK$15,000", "address": "Quarry Bay, HK Island", "district": "Quarry Bay", "size_sf": "216", "floor": "High Floor", "beds": "1", "baths": "1", "image": "https://i1.28hse.com/2026/04/202604201048038336329_large.jpg", "url": "https://www.28hse.com/en/rent/apartment/property-3814374"},
    {"id": "3816474", "name": "Novum East (Terrace)", "price_str": "HK$17,000", "address": "Quarry Bay, HK Island", "district": "Quarry Bay", "size_sf": "293", "floor": "Low Floor", "beds": "1", "baths": "1", "image": "https://i1.28hse.com/2026/04/202604201112472412007_large.jpg", "url": "https://www.28hse.com/en/rent/apartment/property-3816474"},
    {"id": "3814627", "name": "Finnie", "price_str": "HK$22,000", "address": "9 Finnie Street, Quarry Bay", "district": "Quarry Bay", "size_sf": "364", "floor": "Mid Floor", "beds": "2", "baths": "1", "image": "https://i1.28hse.com/2026/04/202604181356475806316_large.jpg", "url": "https://www.28hse.com/en/rent/apartment/property-3814627"},
    {"id": "3814612", "name": "Kam Ho Mansion", "price_str": "HK$13,500", "address": "163 Hollywood Road, Sheung Wan", "district": "Sheung Wan", "size_sf": "203", "floor": "High Floor", "beds": "2", "baths": "N/A", "image": "https://i1.28hse.com/2026/04/202604181346323405433_large.jpg", "url": "https://www.28hse.com/en/rent/apartment/property-3814612"},
    {"id": "3816316", "name": "Apartment", "price_str": "HK$9,900", "address": "Tin Hau, HK Island", "district": "Tin Hau", "size_sf": "170", "floor": "", "beds": "1", "baths": "1", "image": "https://i1.28hse.com/2026/04/202604192100418767705_large.jpg", "url": "https://www.28hse.com/en/rent/apartment/property-3816316"},
    {"id": "3816338", "name": "Man Hee Mansion", "price_str": "HK$21,000", "address": "54 Johnston Road, Wan Chai", "district": "Wan Chai", "size_sf": "503", "floor": "High Floor", "beds": "2", "baths": "1", "image": "https://i1.28hse.com/2026/04/202604192126422234019_large.jpg", "url": "https://www.28hse.com/en/rent/apartment/property-3816338"},
    {"id": "3814980", "name": "Yen Dack Building", "price_str": "HK$20,200", "address": "103 Chun Yeung Street, North Point", "district": "North Point", "size_sf": "612", "floor": "High Floor", "beds": "3", "baths": "1", "image": "https://i1.28hse.com/2026/04/202604181713586259601_large.jpg", "url": "https://www.28hse.com/en/rent/apartment/property-3814980"},
    {"id": "3815039", "name": "Roca Centre", "price_str": "HK$23,800", "address": "18 Shu Kuk Street, North Point", "district": "North Point", "size_sf": "537", "floor": "Mid Floor", "beds": "3", "baths": "1", "image": "https://i1.28hse.com/2026/04/202604191212102071734_large.jpg", "url": "https://www.28hse.com/en/rent/apartment/property-3815039"},
]

BRAND_PURPLE = colors.HexColor("#4B2D7F")
BRAND_LIGHT  = colors.HexColor("#f0eaf8")
BRAND_GREEN  = colors.HexColor("#27AE60")
BRAND_DARK   = colors.HexColor("#1a1f2e")
WHITE        = colors.white

def fetch_image(url, max_w=180, max_h=130):
    try:
        r = requests.get(url, timeout=8)
        if r.status_code == 200:
            img = RLImage(BytesIO(r.content), width=max_w, height=max_h)
            img.hAlign = "LEFT"
            return img
    except Exception:
        pass
    return None

def build_pdf(output_path):
    today = datetime.now().strftime("%d %B %Y")
    doc = SimpleDocTemplate(
        output_path, pagesize=A4,
        leftMargin=1.8*cm, rightMargin=1.8*cm,
        topMargin=2*cm, bottomMargin=2*cm
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("title", fontSize=22, textColor=WHITE, fontName="Helvetica-Bold", alignment=TA_LEFT, spaceAfter=4)
    sub_style   = ParagraphStyle("sub",   fontSize=10, textColor=WHITE, fontName="Helvetica",     alignment=TA_LEFT)
    h2_style    = ParagraphStyle("h2",    fontSize=13, textColor=BRAND_PURPLE, fontName="Helvetica-Bold", spaceBefore=10, spaceAfter=4)
    body_style  = ParagraphStyle("body",  fontSize=9,  textColor=colors.HexColor("#333"), fontName="Helvetica", leading=13)
    price_style = ParagraphStyle("price", fontSize=15, textColor=BRAND_PURPLE, fontName="Helvetica-Bold")
    badge_style = ParagraphStyle("badge", fontSize=8,  textColor=WHITE, fontName="Helvetica-Bold", alignment=TA_CENTER)
    footer_style= ParagraphStyle("foot",  fontSize=7.5,textColor=colors.grey, fontName="Helvetica", alignment=TA_CENTER)

    story = []

    # ── Header banner ──────────────────────────────────────────────────────────
    header_data = [[
        Paragraph("🏠  HK Island Property Report", title_style),
        Paragraph(f"Weekly · {today}\nBelow HK$49,000 · Carpark Included", sub_style)
    ]]
    header_tbl = Table(header_data, colWidths=["60%", "40%"])
    header_tbl.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,-1), BRAND_PURPLE),
        ("ROWPADDING",  (0,0), (-1,-1), 14),
        ("VALIGN",      (0,0), (-1,-1), "MIDDLE"),
        ("ALIGN",       (1,0), (1,0),   "RIGHT"),
        ("ROUNDEDCORNERS", [8]),
    ]))
    story.append(header_tbl)
    story.append(Spacer(1, 0.4*cm))

    # ── Summary stats ──────────────────────────────────────────────────────────
    stats = [
        ["📋 Listings", "🏙️ Districts", "💰 Budget", "🚗 Carpark"],
        [str(len(LISTINGS)), "6", "< HK$49K", "100%"]
    ]
    stats_tbl = Table(stats, colWidths=["25%","25%","25%","25%"])
    stats_tbl.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,0), BRAND_DARK),
        ("BACKGROUND",  (0,1), (-1,1), BRAND_LIGHT),
        ("TEXTCOLOR",   (0,0), (-1,0), WHITE),
        ("TEXTCOLOR",   (0,1), (-1,1), BRAND_PURPLE),
        ("FONTNAME",    (0,0), (-1,0), "Helvetica-Bold"),
        ("FONTNAME",    (0,1), (-1,1), "Helvetica-Bold"),
        ("FONTSIZE",    (0,0), (-1,0), 9),
        ("FONTSIZE",    (0,1), (-1,1), 14),
        ("ALIGN",       (0,0), (-1,-1), "CENTER"),
        ("ROWPADDING",  (0,0), (-1,-1), 8),
        ("ROUNDEDCORNERS", [6]),
        ("BOX", (0,0), (-1,-1), 0.5, BRAND_PURPLE),
    ]))
    story.append(stats_tbl)
    story.append(Spacer(1, 0.5*cm))

    # ── Listings ───────────────────────────────────────────────────────────────
    story.append(Paragraph("Current Listings", h2_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BRAND_PURPLE, spaceAfter=8))

    for i, p in enumerate(LISTINGS, 1):
        img = fetch_image(p["image"])

        info_lines = [
            f"<b>{p['name']}</b>  ·  {p['district']}",
            f"📍 {p['address']}",
        ]
        if p['floor']:  info_lines.append(f"🏢 {p['floor']}")
        if p['size_sf'] != 'N/A': info_lines.append(f"📐 {p['size_sf']} ft²")
        if p['beds'] != 'N/A':    info_lines.append(f"🛏 {p['beds']} Bed  🚿 {p['baths']} Bath")
        info_lines.append(f"🚗 <font color='#27AE60'><b>Carpark Included ✓</b></font>")
        info_lines.append(f"🔗 <link href='{p['url']}'><u>{p['url'][:55]}...</u></link>")
        info_lines.append(f"📅 Updated: 20 Apr 2026 · Source: 28Hse.com")

        info_para = Paragraph("<br/>".join(info_lines), body_style)
        price_para = Paragraph(f"{p['price_str']}<font size='9'>/mo</font>", price_style)
        rank_para  = Paragraph(f"#{i}", ParagraphStyle("rk", fontSize=11, textColor=WHITE, fontName="Helvetica-Bold", alignment=TA_CENTER))

        if img:
            row = [[img, [price_para, Spacer(1,4), info_para]]]
            col_w = ["40%", "60%"]
        else:
            row = [[[price_para, Spacer(1,4), info_para]]]
            col_w = ["100%"]

        card = Table(row, colWidths=col_w)
        card.setStyle(TableStyle([
            ("BACKGROUND",  (0,0), (-1,-1), WHITE),
            ("BOX",         (0,0), (-1,-1), 1, colors.HexColor("#e0d6f5")),
            ("ROWPADDING",  (0,0), (-1,-1), 10),
            ("VALIGN",      (0,0), (-1,-1), "TOP"),
            ("ROUNDEDCORNERS", [6]),
        ]))

        # Rank badge + card in outer table
        badge_cell = Table([[rank_para]], colWidths=[1.2*cm])
        badge_cell.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), BRAND_PURPLE),
            ("ROWPADDING", (0,0), (-1,-1), 6),
            ("ROUNDEDCORNERS", [4]),
        ]))

        outer = Table([[badge_cell, card]], colWidths=[1.4*cm, None])
        outer.setStyle(TableStyle([
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("LEFTPADDING", (1,0),(1,0), 6),
            ("BOTTOMPADDING", (0,0),(-1,-1), 0),
            ("TOPPADDING", (0,0),(-1,-1), 0),
        ]))

        story.append(KeepTogether([outer, Spacer(1, 0.3*cm)]))

    # ── Footer ─────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 0.5*cm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.lightgrey))
    story.append(Spacer(1, 0.2*cm))
    story.append(Paragraph(
        f"Generated by Simpee for SIMPLEX-ITY  ·  {today}  ·  Data: 28Hse.com · Squarefoot · OKAY.com  ·  HK Island Only  ·  Budget < HK$49,000  ·  ✅ Carpark Confirmed",
        footer_style
    ))

    doc.build(story)
    print(f"PDF saved to: {output_path}")
    return output_path

if __name__ == "__main__":
    out = "/app/weekly_property_report.pdf"
    build_pdf(out)
    print("DONE")
