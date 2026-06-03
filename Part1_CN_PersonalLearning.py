from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# Use a CJK font
font_paths = [
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc",
]

font_registered = False
for fp in font_paths:
    if os.path.exists(fp):
        pdfmetrics.registerFont(TTFont('NotoSansCJK', fp))
        font_registered = True
        print(f"Font found: {fp}")
        break

if not font_registered:
    # Find any CJK font
    import subprocess
    result = subprocess.run(['find', '/usr/share/fonts', '-name', '*.ttc', '-o', '-name', '*.ttf'], 
                          capture_output=True, text=True)
    print("Available fonts:")
    print(result.stdout[:2000])
