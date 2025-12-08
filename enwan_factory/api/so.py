import frappe


def update_sales_person_targets(doc, method):
    """Update sales person targets when a Sales Order is submitted or cancelled"""

    # Determine if we're adding or subtracting based on the method
    is_cancel = method == "on_cancel"
    action = "Reversing" if is_cancel else "Updating"

    # Get list of sales persons on this sales order
    sales_persons = [d.sales_person for d in doc.sales_team]

    if not sales_persons:
        return

    frappe.msgprint(f"{action} targets for: {', '.join(sales_persons)}")

    for sp in sales_persons:
        try:
            # fetch target detail rows for this Sales Person
            target_rows = frappe.get_all(
                "Target Detail",
                filters={"parent": sp, "parenttype": "Sales Person"},
                fields=[
                    "name",
                    "parent",
                    "custom_from_date",
                    "custom_to_date",
                    "item_group",
                ],
            )

            if not target_rows:
                frappe.msgprint(f"No target details found for {sp}")
                continue

            for row in target_rows:
                # Recalculate total achievement from all submitted Sales Orders
                result = frappe.db.sql(
                    """
                    SELECT SUM(soi.qty)
                    FROM `tabSales Order Item` soi
                    JOIN `tabSales Order` so ON soi.parent = so.name
                    JOIN `tabSales Team` st ON st.parent = so.name
                    WHERE st.sales_person = %s
                      AND soi.item_group = %s
                      AND so.transaction_date BETWEEN %s AND %s
                      AND so.docstatus = 1
                """,
                    (sp, row.item_group, row.custom_from_date, row.custom_to_date),
                    as_dict=False,
                )

                total_qty = result[0][0] if result and result[0][0] else 0

                # Update Target Detail with recalculated total
                frappe.db.set_value(
                    "Target Detail",
                    row.name,
                    "custom_actual_achievement",
                    total_qty,
                    update_modified=False,
                )

                frappe.msgprint(f"{action} {row.item_group}: {total_qty} qty for {sp}")

        except Exception as e:
            frappe.log_error(f"Error {action.lower()} targets for {sp}: {str(e)}")
            frappe.msgprint(f"Error {action.lower()} {sp}: {str(e)}", indicator="red")
