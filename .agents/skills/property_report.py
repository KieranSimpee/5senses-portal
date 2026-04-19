#!/usr/bin/env python3
"""
Property Report Generator
Generates HK Property Search Reports in PDF, Word (DOCX), and PNG formats.

Usage:
    python property_report.py --format pdf --output /tmp/property_report.pdf
    python property_report.py --format docx --output /tmp/property_report.docx
    python property_report.py --format png --output /tmp/property_report.png

Input: reads report_data.json from same directory (injected by agent before running)
"""

import sys
import json
import os
import argparse
from datetime import datetime

# ── Load report data ──────────────────────────────────────────────────────────
DATA_FILE = os.path.join(os.path.dirname(__file__), "report_data.json")

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE) as f:
            return json.load(f)
    # Default sample data if no data file
    return {
        "date": datetime.now().strftime("%A, %d %b %Y"),
        "budget": "HK$50,000",
        "total_scanned": 47,
        "new_today": 2,
        "price_drops": 1,
        "properties": [
            {
                "name": "Waiga Mansion",
                "district": "Happy Valley",
                "price": "HK$48,000",
                "beds": 3,
                "baths": 2,
                "size": "1,097 SF",
                "carpark": True,
                "source": "OKAY.com",
                "updated": "13 Apr 2026",
                "badge": "NEW TODAY",
                "url": "https://www.okay.com/en/property-search/rent/happy-valley/price-40000-50000-hkd",
                "image_url": ""
            },
            {
                "name": "Blessings Garden Ph.2",
                "district": "Mid-Levels West",
                "price": "HK$42,000",
                "beds": 3,
                "baths": 2,
                "size": "797 SF",
                "carpark": True,
                "source": "OKAY.com",
                "updated": "17 Apr 2026",
                "badge": "BEST VALUE",
                "url": "https://www.okay.com/en/property-search/rent/mid-levels-west/price-40000-50000-hkd",
                "image_url": ""
            },
            {
                "name": "Green Lane Court",
                "district": "Happy Valley",
                "price": "HK$43,800",
                "beds": 3,
                "baths": 2,
                "size": "1,131 SF",
                "carpark": True,
                "source": "OKAY.com",
                "updated": "16 Apr 2026",
                "badge": "PRICE DROP",
                "url": "https://www.okay.com/en/property-search/rent/happy-valley/price-40000-50000-hkd",
                "image_url": ""
            }
        ]
    }

# ── PDF Generator ─────────────────────────────────────────────────────────────
def generate_pdf(data, output_path):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import mm
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
    from reportlab.lib.enums import TA_CENTER, TA_LEFT

    PURPLE = colors.HexColor("#4B2D7F")
    LIGHT_PURPLE = colors.HexColor("#7B4FBF")
    SOFT_PURPLE = colors.HexColor("#F3EEFF")
    GREEN = colors.HexColor("#27AE60")
    ORANGE = colors.HexColor("#E67E22")
    WHITE = colors.white
    DARK = colors.HexColor("#1A1A2E")
    GREY = colors.HexColor("#888888")

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=15*mm,
        leftMargin=15*mm,
        topMargin=15*mm,
        bottomMargin=15*mm
    )

    styles = getSampleStyleSheet()
    elements = []

    # ── Header ────────────────────────────────────────────────────────────────
    header_data = [[
        Paragraph(
            f'<font color="white"><b>🏠  SIMPLEX-ITY · HK ISLAND PROPERTY REPORT</b></font>',
            ParagraphStyle("h", fontSize=16, textColor=WHITE, alignment=TA_CENTER)
        )
    ]]
    header_table = Table(header_data, colWidths=[180*mm])
    header_table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), PURPLE),
        ("PADDING", (0,0), (-1,-1), 12),
        ("ROWBACKGROUNDS", (0,0), (-1,-1), [PURPLE]),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 4*mm))

    # ── Sub-header ────────────────────────────────────────────────────────────
    sub = Paragraph(
        f'<font color="#4B2D7F">{data["date"]} &nbsp;·&nbsp; Budget: Below {data["budget"]} &nbsp;·&nbsp; 🚗 Carpark Included</font>',
        ParagraphStyle("sub", fontSize=10, alignment=TA_CENTER)
    )
    elements.append(sub)
    elements.append(Spacer(1, 6*mm))

    # ── Stats bar ─────────────────────────────────────────────────────────────
    stats_data = [[
        Paragraph(f'<b>📊 {data["total_scanned"]}</b><br/>Listings Scanned',
                  ParagraphStyle("s", fontSize=9, alignment=TA_CENTER)),
        Paragraph(f'<b>⭐ {data["new_today"]}</b><br/>New Today',
                  ParagraphStyle("s", fontSize=9, alignment=TA_CENTER)),
        Paragraph(f'<b>📉 {data["price_drops"]}</b><br/>Price Drops',
                  ParagraphStyle("s", fontSize=9, alignment=TA_CENTER)),
        Paragraph(f'<b>🔍 OKAY.com · Squarefoot · 28hse</b><br/>Sources',
                  ParagraphStyle("s", fontSize=9, alignment=TA_CENTER)),
    ]]
    stats_table = Table(stats_data, colWidths=[45*mm]*4)
    stats_table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), SOFT_PURPLE),
        ("PADDING", (0,0), (-1,-1), 8),
        ("GRID", (0,0), (-1,-1), 0.5, LIGHT_PURPLE),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ]))
    elements.append(stats_table)
    elements.append(Spacer(1, 8*mm))

    # ── Property Cards ────────────────────────────────────────────────────────
    badge_colors = {
        "NEW TODAY": GREEN,
        "BEST VALUE": LIGHT_PURPLE,
        "PRICE DROP": ORANGE,
    }

    for i, prop in enumerate(data["properties"], 1):
        badge_color = badge_colors.get(prop.get("badge", ""), LIGHT_PURPLE)
        carpark_text = "✅ Carpark Included" if prop.get("carpark") else "❌ No Carpark"

        card_data = [
            [
                Paragraph(
                    f'<font color="white"><b>  {prop.get("badge", "LISTING")}  </b></font>',
                    ParagraphStyle("badge", fontSize=9, textColor=WHITE)
                ),
                Paragraph(
                    f'<font color="white"><b>{prop["price"]} / mo</b></font>',
                    ParagraphStyle("price", fontSize=13, textColor=WHITE, alignment=TA_LEFT)
                )
            ],
            [
                Paragraph(
                    f'<b><font color="#4B2D7F" size=13>{prop["name"]}</font></b>',
                    ParagraphStyle("name", fontSize=13)
                ),
                Paragraph(
                    f'📍 {prop["district"]}',
                    ParagraphStyle("district", fontSize=10, textColor=GREY)
                )
            ],
            [
                Paragraph(
                    f'🛏 {prop["beds"]} Beds  &nbsp; 🚿 {prop["baths"]} Bath  &nbsp; 📐 {prop["size"]}',
                    ParagraphStyle("details", fontSize=10)
                ),
                Paragraph(carpark_text, ParagraphStyle("cp", fontSize=10, textColor=GREEN))
            ],
            [
                Paragraph(
                    f'<font color="#888888">Source: {prop["source"]} · Updated {prop["updated"]}</font>',
                    ParagraphStyle("src", fontSize=8)
                ),
                Paragraph(
                    f'<link href="{prop["url"]}"><font color="#4B2D7F"><u>View Listing →</u></font></link>',
                    ParagraphStyle("link", fontSize=9)
                )
            ]
        ]

        card_table = Table(card_data, colWidths=[95*mm, 85*mm])
        card_table.setStyle(TableStyle([
            # Badge row
            ("BACKGROUND", (0,0), (-1,0), badge_color),
            ("PADDING", (0,0), (-1,0), 6),
            # Rest of card
            ("BACKGROUND", (0,1), (-1,-1), WHITE),
            ("PADDING", (0,1), (-1,-1), 8),
            ("BOX", (0,0), (-1,-1), 1, LIGHT_PURPLE),
            ("LINEBELOW", (0,0), (-1,0), 0, WHITE),
            ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ]))
        elements.append(card_table)
        elements.append(Spacer(1, 5*mm))

    # ── Footer ────────────────────────────────────────────────────────────────
    elements.append(HRFlowable(width="100%", thickness=1, color=PURPLE))
    elements.append(Spacer(1, 3*mm))
    elements.append(Paragraph(
        '<font color="#4B2D7F">Powered by <b>Simpee</b> for SIMPLEX-ITY &nbsp;·&nbsp; Daily HK Property Intelligence &nbsp;·&nbsp; Data from OKAY.com, Squarefoot.com.hk, 28hse.com</font>',
        ParagraphStyle("footer", fontSize=8, alignment=TA_CENTER)
    ))

    doc.build(elements)
    print(f"✅ PDF generated: {output_path}")
    return output_path


# ── DOCX Generator ────────────────────────────────────────────────────────────
def generate_docx(data, output_path):
    from docx import Document
    from docx.shared import Pt, RGBColor, Inches, Cm
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement

    PURPLE = RGBColor(0x4B, 0x2D, 0x7F)
    WHITE = RGBColor(0xFF, 0xFF, 0xFF)
    GREEN = RGBColor(0x27, 0xAE, 0x60)
    ORANGE = RGBColor(0xE6, 0x7E, 0x22)
    GREY = RGBColor(0x88, 0x88, 0x88)

    doc = Document()

    # Page margins
    for section in doc.sections:
        section.top_margin = Cm(1.5)
        section.bottom_margin = Cm(1.5)
        section.left_margin = Cm(1.5)
        section.right_margin = Cm(1.5)

    # ── Title ─────────────────────────────────────────────────────────────────
    title = doc.add_heading("🏠  SIMPLEX-ITY · HK ISLAND PROPERTY REPORT", level=1)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for run in title.runs:
        run.font.color.rgb = PURPLE
        run.font.size = Pt(18)

    sub = doc.add_paragraph(f"{data['date']}  ·  Budget: Below {data['budget']}  ·  🚗 Carpark Included")
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub.runs[0].font.color.rgb = PURPLE
    sub.runs[0].font.size = Pt(10)

    doc.add_paragraph()

    # ── Stats ─────────────────────────────────────────────────────────────────
    stats = doc.add_paragraph()
    stats.alignment = WD_ALIGN_PARAGRAPH.CENTER
    stats.add_run(f"📊 {data['total_scanned']} Listings Scanned  |  ⭐ {data['new_today']} New Today  |  📉 {data['price_drops']} Price Drops  |  🔍 OKAY.com · Squarefoot · 28hse")
    stats.runs[0].font.size = Pt(9)
    stats.runs[0].font.color.rgb = PURPLE

    doc.add_paragraph()

    # ── Property Cards ────────────────────────────────────────────────────────
    badge_labels = {"NEW TODAY": "🆕", "BEST VALUE": "⭐", "PRICE DROP": "📉"}

    for prop in data["properties"]:
        badge = prop.get("badge", "LISTING")
        emoji = badge_labels.get(badge, "🏠")
        carpark_text = "✅ Carpark Included" if prop.get("carpark") else "❌ No Carpark"

        # Property heading
        h = doc.add_heading(f'{emoji}  {prop["name"]}  —  {badge}', level=2)
        for run in h.runs:
            run.font.color.rgb = PURPLE
            run.font.size = Pt(13)

        # Price
        p = doc.add_paragraph()
        r = p.add_run(f'💰 {prop["price"]} / month  ·  📍 {prop["district"]}')
        r.bold = True
        r.font.size = Pt(12)
        r.font.color.rgb = PURPLE

        # Details
        details = doc.add_paragraph()
        details.add_run(f'🛏 {prop["beds"]} Beds   🚿 {prop["baths"]} Bath   📐 {prop["size"]}   {carpark_text}')
        details.runs[0].font.size = Pt(10)

        # Source & link
        src = doc.add_paragraph()
        src.add_run(f'Source: {prop["source"]}  ·  Updated: {prop["updated"]}  ·  ')
        link_run = src.add_run(f'View Listing → {prop["url"]}')
        link_run.font.color.rgb = PURPLE
        link_run.underline = True
        src.runs[0].font.size = Pt(8)
        src.runs[0].font.color.rgb = GREY

        doc.add_paragraph("─" * 80)

    # ── Footer ────────────────────────────────────────────────────────────────
    footer = doc.add_paragraph()
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    fr = footer.add_run("Powered by Simpee for SIMPLEX-ITY  ·  Daily HK Property Intelligence  ·  Data from OKAY.com, Squarefoot.com.hk, 28hse.com")
    fr.font.size = Pt(8)
    fr.font.color.rgb = PURPLE

    doc.save(output_path)
    print(f"✅ DOCX generated: {output_path}")
    return output_path


# ── PNG Generator ─────────────────────────────────────────────────────────────
def generate_png(data, output_path):
    """Uses Pillow to generate a clean report image"""
    from PIL import Image, ImageDraw, ImageFont
    import textwrap

    W, H = 1200, 900
    PURPLE = (75, 45, 127)
    LIGHT_PURPLE = (123, 79, 191)
    SOFT_PURPLE = (243, 238, 255)
    GREEN = (39, 174, 96)
    ORANGE = (230, 126, 34)
    WHITE = (255, 255, 255)
    DARK = (26, 26, 46)
    GREY = (136, 136, 136)

    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    # Try to load a font, fallback to default
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
        font_med = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
        font_tiny = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    except:
        font_large = font_med = font_small = font_tiny = ImageFont.load_default()

    # Header
    draw.rectangle([0, 0, W, 80], fill=PURPLE)
    draw.text((W//2, 40), "HK ISLAND PROPERTY REPORT", fill=WHITE, font=font_large, anchor="mm")

    # Subheader
    draw.rectangle([0, 80, W, 115], fill=SOFT_PURPLE)
    draw.text((W//2, 97), f"{data['date']}  ·  Budget: Below {data['budget']}  ·  Carpark Included", fill=PURPLE, font=font_small, anchor="mm")

    # Stats bar
    draw.rectangle([0, 115, W, 160], fill=SOFT_PURPLE)
    stats_items = [
        (f"Scanned: {data['total_scanned']}", 150),
        (f"New Today: {data['new_today']}", 400),
        (f"Price Drops: {data['price_drops']}", 650),
        ("OKAY.com · Squarefoot · 28hse", 950),
    ]
    for text, x in stats_items:
        draw.text((x, 137), text, fill=PURPLE, font=font_small, anchor="mm")

    # Property Cards
    badge_colors = {"NEW TODAY": GREEN, "BEST VALUE": LIGHT_PURPLE, "PRICE DROP": ORANGE}
    card_w = 370
    card_x_positions = [20, 415, 810]
    card_y = 175

    for i, prop in enumerate(data["properties"][:3]):
        x = card_x_positions[i]
        badge_color = badge_colors.get(prop.get("badge", ""), LIGHT_PURPLE)

        # Card background
        draw.rectangle([x, card_y, x+card_w, card_y+680], fill=WHITE, outline=LIGHT_PURPLE, width=2)

        # Badge bar
        draw.rectangle([x, card_y, x+card_w, card_y+40], fill=badge_color)
        draw.text((x+card_w//2, card_y+20), prop.get("badge", "LISTING"), fill=WHITE, font=font_med, anchor="mm")

        # Image placeholder area
        draw.rectangle([x+10, card_y+50, x+card_w-10, card_y+250], fill=SOFT_PURPLE, outline=LIGHT_PURPLE)
        draw.text((x+card_w//2, card_y+150), "🏠 Property Photo", fill=PURPLE, font=font_small, anchor="mm")

        # Property name
        draw.text((x+card_w//2, card_y+270), prop["name"], fill=PURPLE, font=font_med, anchor="mm")

        # District
        draw.text((x+card_w//2, card_y+300), f"📍 {prop['district']}", fill=GREY, font=font_small, anchor="mm")

        # Price
        draw.rectangle([x+20, card_y+320, x+card_w-20, card_y+360], fill=PURPLE)
        draw.text((x+card_w//2, card_y+340), prop["price"] + " / mo", fill=WHITE, font=font_med, anchor="mm")

        # Details
        draw.text((x+card_w//2, card_y+385), f"Beds: {prop['beds']}  Bath: {prop['baths']}  Size: {prop['size']}", fill=DARK, font=font_small, anchor="mm")

        # Carpark
        cp_color = GREEN if prop.get("carpark") else ORANGE
        cp_text = "✅ Carpark Included" if prop.get("carpark") else "❌ No Carpark"
        draw.text((x+card_w//2, card_y+415), cp_text, fill=cp_color, font=font_small, anchor="mm")

        # Source
        draw.text((x+card_w//2, card_y+445), f"Source: {prop['source']}", fill=GREY, font=font_tiny, anchor="mm")
        draw.text((x+card_w//2, card_y+465), f"Updated: {prop['updated']}", fill=GREY, font=font_tiny, anchor="mm")

    # Footer
    draw.rectangle([0, H-50, W, H], fill=PURPLE)
    draw.text((W//2, H-25), "Powered by Simpee for SIMPLEX-ITY  ·  OKAY.com · Squarefoot · 28hse", fill=WHITE, font=font_tiny, anchor="mm")

    img.save(output_path, "PNG", dpi=(150, 150))
    print(f"✅ PNG generated: {output_path}")
    return output_path


# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate HK Property Report")
    parser.add_argument("--format", choices=["pdf", "docx", "png", "all"], default="all")
    parser.add_argument("--output", default="/tmp/property_report")
    args = parser.parse_args()

    data = load_data()

    outputs = []
    if args.format in ("pdf", "all"):
        out = args.output if args.format == "pdf" else args.output + ".pdf"
        generate_pdf(data, out)
        outputs.append(out)

    if args.format in ("docx", "all"):
        out = args.output if args.format == "docx" else args.output + ".docx"
        generate_docx(data, out)
        outputs.append(out)

    if args.format in ("png", "all"):
        out = args.output if args.format == "png" else args.output + ".png"
        generate_png(data, out)
        outputs.append(out)

    print("\n📦 Generated files:")
    for o in outputs:
        print(f"  → {o}")
