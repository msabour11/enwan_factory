import frappe
from frappe.model.mapper import get_mapped_doc


@frappe.whitelist()
def make_material_request(source_name, target_doc=None):
    def update_item(source, target, source_parent):
        target.qty = 1

    doc = get_mapped_doc(
        "Quotation",
        source_name,
        {
            "Quotation": {
                "doctype": "Material Request",
                "field_map": {
                    "transaction_date": "schedule_date",
                },
            },
            "Quotation Item": {
                "doctype": "Material Request Item",
                "field_map": {
                    "item_code": "item_code",
                    "description": "description",
                    "uom": "uom",
                    "stock_uom": "stock_uom",
                },
                "postprocess": update_item,
            },
        },
        target_doc,
    )

    doc.material_request_type = "Purchase"
    return doc


# # qty description


def before_save(doc, method):

    def ltr(text):
        return f"\u202a{text}\u202c"

    for row in doc.items:
        if row.item_group == "مجسمات":
            parts = []

            if row.custom_product:
                parts.append(f"المنتج: {row.custom_product}")

            if row.custom_service:
                parts.append(f"الخدمة: {row.custom_service}")
            if row.custom_limitations:
                parts.append(f"القيود: {row.custom_limitations}")

            if row.custom_print:
                parts.append(f"الطباعة: {row.custom_print}")

            if row.custom_grams:
                parts.append(f"الجرام: {row.custom_grams}")

            if row.custom_shape_paper_type:
                parts.append(f"نوع الورق: {row.custom_shape_paper_type}")

            if row.custom_length:
                parts.append(f"الطول: {row.custom_length}")

            if row.custom_width:
                parts.append(f"العرض: {row.custom_width}")

            if row.custom_height:
                parts.append(f"الارتفاع: {row.custom_height}")

            row.custom_product_description = ltr(" | ".join(parts))

        elif row.item_group == "المنتجات الكرتونية المدمجة":
            parts = []

            if row.custom_product:
                parts.append(f"المنتج: {row.custom_product}")

            if row.custom_paper_type:
                parts.append(f"نوع الورق: {row.custom_paper_type}")

            if row.custom_print:
                parts.append(f"الطباعة: {row.custom_print}")

            if row.custom_length:
                parts.append(f"الطول: {row.custom_length}")

            if row.custom_width:
                parts.append(f"العرض: {row.custom_width}")

            if row.custom_height:
                parts.append(f"الارتفاع: {row.custom_height}")

            row.custom_product_description = ltr(" | ".join(parts))
        elif row.item_group == "بولات":
            parts = []

            parts.append(f" {row.item_code}")

            if row.custom_size:
                parts.append(f"المقاس: {row.custom_size}")

            if row.custom_bolt_cover_type:
                parts.append(f"نوع الغطاء: {row.custom_bolt_cover_type}")

            row.custom_product_description = ltr(" | ".join(parts))

        elif row.item_group == "الاكواب البلاستيكية":
            parts = []

            parts.append(f" {row.item_code}")
            if row.custom_plastic_types:
                parts.append(f" النوع: {row.custom_plastic_types}")

            if row.custom_size:
                parts.append(f"المقاس: {row.custom_size}")
            if row.custom_plastic_cover_type:
                parts.append(f"نوع الغطاء: {row.custom_plastic_cover_type}")

            row.custom_product_description = ltr(" | ".join(parts))
        elif row.item_group == "أكياس ورقية كرافت":
            parts = []

            parts.append(f" {row.item_code}")
            if row.custom_length:
                parts.append(f" الطول: {row.custom_length}")
            if row.custom_width:
                parts.append(f" العرض: {row.custom_width}")
            if row.custom_height:
                parts.append(f" الارتفاع: {row.custom_height}")

            if row.custom_variables:
                parts.append(f"متغيرات: {row.custom_variables}")

            row.custom_product_description = ltr(" | ".join(parts))
        elif row.item_group == "اكواب ورقية":
            parts = []

            parts.append(f" {row.item_code}")
            if row.custom_size:
                parts.append(f"المقاس: {row.custom_size}")

            # if row.custom_layers:
            #     parts.append(f"عدد الطبقات: {row.custom_layers}")
            if row.custom_additional_services:
                parts.append(f"خدمات إضافية: {row.custom_additional_services}")
            if row.custom_cover_type:
                parts.append(f"نوع الغطاء: {row.custom_cover_type}")
            if row.custom_cover_description:
                parts.append(f"وصف الغطاء: {row.custom_cover_description}")
            if row.custom_cover_size:
                parts.append(f"مقاس الغطاء: {row.custom_cover_size}")
            if row.custom_cover_color:
                parts.append(f"لون الغطاء: {row.custom_cover_color}")

            row.custom_product_description = ltr(" | ".join(parts))
