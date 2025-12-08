import frappe

def create_quotations_from_sales_person(sales_person):
    customers = frappe.get_all(
        "Customer",
        filters={"sales_person": sales_person},
        fields=["name"],
    )

    for customer in customers:
        quotation = frappe.get_doc(
            {
                "doctype": "Quotation",
                "customer": customer.name,
                "sales_person": sales_person,
                "quotation_to": "Customer",
            }
        )
        quotation.insert()
        quotation.submit()