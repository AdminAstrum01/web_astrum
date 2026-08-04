#!/usr/bin/env python3
import io
from pathlib import Path

import fitz
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "documents" / "acreditaciones" / "bridges-of-equity.pdf"
OUT_DIR = ROOT / "documents" / "acreditaciones"
OUT_DIR.mkdir(parents=True, exist_ok=True)

ORGANIZATIONS = [
    ("holo-astrum-unmsm.pdf", "Holo Astrum UNMSM", "RA-2026-HAU-ONG"),
    ("rikchari.pdf", "Rikchari", "RA-2026-RK-ONG"),
    ("oportunidades-con-impacto.pdf", "Oportunidades con Impacto", "RA-2026-OCI-ONG"),
    ("for-our-rights.pdf", "For Our Rights", "RA-2026-FOR-ONG"),
]

PURPLE = (0.42, 0.18, 0.63)
BLACK = (0, 0, 0)
GRAY = (0.65, 0.65, 0.68)

BODY = (
    "Se encuentra formalmente afiliada e integrada al ecosistema institucional de la Asociación Red Astrum, "
    "participando activamente en espacios de articulación, cooperación, representación juvenil, fortalecimiento "
    "organizacional y desarrollo de iniciativas sociales promovidas por la Asociación.\n\n"
    "La presente acreditación tiene por finalidad respaldar institucionalmente a la organización afiliada ante "
    "entidades públicas, privadas, organismos nacionales e internacionales, así como otras organizaciones de la "
    "sociedad civil, permitiendo acreditar su vínculo de colaboración y reconocimiento dentro de la red "
    "institucional de Red Astrum.\n\n"
    "Asimismo, se deja constancia de que la organización mencionada mantiene una relación activa de "
    "coordinación y participación conforme a los principios, objetivos y lineamientos institucionales "
    "establecidos por la Asociación Red Astrum.\n\n"
    "La presente constancia se expide a solicitud de la parte interesada para los fines que estime convenientes."
)


def center_text(page, y, text, fontname, fontsize, color=BLACK):
    width = fitz.get_text_length(text, fontname=fontname, fontsize=fontsize)
    page.insert_text(((page.rect.width - width) / 2, y), text, fontname=fontname, fontsize=fontsize, color=color)


def center_text_at(page, center_x, y, text, fontname, fontsize, color=BLACK):
    width = fitz.get_text_length(text, fontname=fontname, fontsize=fontsize)
    page.insert_text((center_x - width / 2, y), text, fontname=fontname, fontsize=fontsize, color=color)


def make_background(template_page, page_number):
    pix = template_page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    draw = ImageDraw.Draw(image)
    scale = 2
    if page_number == 1:
        draw.rectangle([25 * scale, 145 * scale, 570 * scale, 690 * scale], fill="white")
    else:
        draw.rectangle([30 * scale, 112 * scale, 565 * scale, 390 * scale], fill="white")
        draw.rectangle([30 * scale, 440 * scale, 455 * scale, 505 * scale], fill="white")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG", optimize=True)
    return buffer.getvalue()


def create_certificate(filename, organization, code):
    template = fitz.open(TEMPLATE)
    output = fitz.open()

    for index in range(2):
        page = output.new_page(width=596, height=842)
        page.insert_image(page.rect, stream=make_background(template[index], index + 1))
        if index == 1:
            page.draw_line(fitz.Point(0, 120), fitz.Point(225, 120), color=(1.0, 0.4, 0.05), width=1.5, overlay=True)

        if index == 0:
            page.insert_textbox(
                fitz.Rect(85, 155, 511, 216),
                "CONSTANCIA DE ACREDITACIÓN\nINSTITUCIONAL",
                fontname="Times-Bold",
                fontsize=24,
                lineheight=1.0,
                align=fitz.TEXT_ALIGN_CENTER,
                color=PURPLE,
            )
            center_text(page, 240, "ASOCIACIÓN RED ASTRUM", "Times-Bold", 13)
            center_text(page, 254, "RUC N.° 20615815005", "Times-Roman", 11)
            center_text(page, 268, "Domicilio legal: dato reservado", "Times-Roman", 10)
            page.insert_text((35.4, 310), f"CONSTANCIA N.° {code}", fontname="Times-Bold", fontsize=17)

            intro = (
                "La Asociación Red Astrum, identificada con RUC N.° 20615815005, debidamente representada por su\n"
                "Representante Legal, el señor Jesús Gálvez, deja constancia mediante el presente documento que:"
            )
            page.insert_textbox(
                fitz.Rect(35.4, 322, 560, 352),
                intro,
                fontname="Times-Roman",
                fontsize=10.2,
                lineheight=1.18,
                align=fitz.TEXT_ALIGN_LEFT,
            )
            center_text(page, 416, organization, "Times-Bold", 18)
            page.insert_textbox(
                fitz.Rect(35.4, 429, 560, 625),
                BODY,
                fontname="Times-Roman",
                fontsize=10.2,
                lineheight=1.22,
                align=fitz.TEXT_ALIGN_JUSTIFY,
            )
            page.insert_text((35.4, 651), "Lugar y fecha de emisión:", fontname="Times-Bold", fontsize=11)
            page.insert_text((35.4, 679), "Lima, Perú", fontname="Times-Bold", fontsize=11)
        else:
            page.insert_text((35.4, 149), "Tres de agosto del dos mil veintiséis (03/08/2026)", fontname="Times-Bold", fontsize=12)
            page.insert_text((35.4, 186), "FIRMAN:", fontname="Times-Bold", fontsize=20)
            signature_boxes = [fitz.Rect(88, 203, 244, 303), fitz.Rect(350, 203, 506, 303)]
            for box in signature_boxes:
                page.draw_rect(box, color=(0.82, 0.82, 0.82), width=0.8, overlay=True)
                label = "FIRMA RESERVADA"
                label_width = fitz.get_text_length(label, fontname="Helvetica-Bold", fontsize=10)
                page.insert_text((box.x0 + (box.width - label_width) / 2, box.y0 + 54), label, fontname="Helvetica-Bold", fontsize=10, color=(0.5, 0.5, 0.5))

            center_text_at(page, 166.5, 330, "Jesús Gálvez", "Times-Bold", 11)
            center_text_at(page, 166.5, 346, "Representante Legal", "Times-Bold", 11)
            center_text_at(page, 166.5, 362, "Asociación Red Astrum", "Times-Bold", 11)
            center_text_at(page, 428.5, 330, "Mary Ann Thomas", "Times-Bold", 11)
            center_text_at(page, 428.5, 346, "Coordinadora de ONGs", "Times-Bold", 11)
            center_text_at(page, 428.5, 362, "Asociación Red Astrum", "Times-Bold", 11)

            footer1 = "Esta certificación ha sido emitido por Red Astrum y puede verificarse con el código"
            footer2 = f"{code} en el registro oficial disponible en https://bit.ly/astrumverificar"
            page.insert_text((35.4, 470), footer1, fontname="Times-Italic", fontsize=9.5, color=GRAY)
            page.insert_text((35.4, 487), footer2, fontname="Times-Italic", fontsize=9.5, color=GRAY)

    output.set_metadata({
        "title": f"Constancia de acreditación institucional - {organization}",
        "author": "Asociación Red Astrum",
        "subject": "Versión pública con datos personales reservados",
        "keywords": f"Red Astrum, acreditación institucional, {code}",
        "creator": "Asociación Red Astrum",
        "producer": "Red Astrum",
    })
    output.save(OUT_DIR / filename, garbage=4, deflate=True, clean=True)
    output.close()
    template.close()


for item in ORGANIZATIONS:
    create_certificate(*item)
    print(f"Generated {item[0]}")
