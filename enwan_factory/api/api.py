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
