frappe.ui.form.on("Opportunity Item", {
  custom_add_service(frm, cdt, cdn) {
    open_services_dialog(frm, cdt, cdn);
  },
});

// MultiSelect Dialog Logic
function open_services_dialog(frm, cdt, cdn) {
  const row = locals[cdt][cdn];

  let d = new frappe.ui.form.MultiSelectDialog({
    doctype: "Additional Services",
    target: frm,

    setters: {},

    get_query() {
      return {
        filters: {
          enable: 1,
        },
      };
    },

    action(selections) {
      if (!selections || !selections.length) return;

      frappe.model.set_value(
        cdt,
        cdn,
        "custom_additional_services_list",
        selections.join("\n")
      );

      d.dialog.hide();
    },
  });
}
