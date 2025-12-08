frappe.ui.form.on("Sales Person", {
  refresh(frm) {
    frm.add_custom_button("Create Quotaions", function () {
      frappe.new_doc("Quotation", {
        custom_sales_person: frm.doc.name,
      });
    });
  },
});
