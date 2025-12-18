frappe.ui.form.on("Quotation", {
  refresh(frm) {
    // add material request button
    frm.add_custom_button(__("Material Request"), function () {
      frappe.model.open_mapped_doc({
        method: "enwan_factory.api.api.make_material_request",
        frm: frm,
      });
    });

    // filterChildFields(
    //   frm,
    //   "items",
    //   "custom_layers",
    //   "layers",
    //   "custom_additional_services"
    // );
    // filterCoverFields(
    //   frm,
    //   "items",
    //   "custom_cover_type",
    //   "cover_type",
    //   "custom_cover_size"
    // );
  },

  //////////////translations
  // before_save(frm) {
  //   const labels = {
  //     size: "المقاس",
  //     layers: "عدد الطبقات",
  //     additional_services: "الخدمات الإضافية",
  //     cover_type: "نوع الغطاء",
  //     cover_size: "مقاس الغطاء",
  //     cover_color: "لون الغطاء",
  //     type: "النوع",
  //     length: "الطول",
  //     width: "العرض",
  //     height: "الارتفاع",
  //     variables: "المتغيرات",
  //   };

  //   frm.doc.items.forEach((row) => {
  //     if (row.item_group === "اكواب ورقية") {
  //       let desc = `${row.item_code} - ${labels.size}: ${row.custom_size}, ${labels.layers}: ${row.custom_layers}, ${labels.additional_services}: ${row.custom_additional_services}, ${labels.cover_type}: ${row.custom_cover_type}, ${labels.cover_size}: ${row.custom_cover_size}, ${labels.cover_color}: ${row.custom_cover_color}`;

  //       frappe.model.set_value(
  //         row.doctype,
  //         row.name,
  //         "custom_product_description",
  //         desc
  //       );
  //     } else if (row.item_group === "الاكواب البلاستيكية") {
  //       let desc = `${row.item_code} - ${labels.type}: ${row.custom_plastic_types}, ${labels.size}: ${row.custom_size}, ${labels.cover_type}: ${row.custom_plastic_cover_type}`;

  //       frappe.model.set_value(
  //         row.doctype,
  //         row.name,
  //         "custom_product_description",
  //         desc
  //       );
  //     } else if (row.item_group === "أكياس ورقية كرافت") {
  //       let desc = `${row.item_code} - ${labels.length}: ${row.custom_length}, ${labels.width}: ${row.custom_width}, ${labels.height}: ${row.custom_height}, ${labels.variables}: ${row.custom_variables}`;

  //       frappe.model.set_value(
  //         row.doctype,
  //         row.name,
  //         "custom_product_description",
  //         desc
  //       );
  //     } else if (row.item_group === "بولات") {
  //       let desc = `${row.item_code} - ${labels.size}: ${row.custom_size}, ${labels.cover_type}: ${row.custom_bolt_cover_type}`;

  //       frappe.model.set_value(
  //         row.doctype,
  //         row.name,
  //         "custom_product_description",
  //         desc
  //       );
  //     } else if (row.item_group === "مجسمات") {
  //       let desc = `${row.custom_product}, ${row.custom_service}, ${row.custom_limitations}, ${row.custom_print}, ${row.custom_grams}, ${row.custom_shape_paper_type}, ${row.custom_length}, ${row.custom_width}, ${row.custom_height}`;

  //       frappe.model.set_value(
  //         row.doctype,
  //         row.name,
  //         "custom_product_description",
  //         desc
  //       );
  //     } else if (row.item_group === "المنتجات الكرتونية المدمجة") {
  //       let desc = `${row.custom_product}, ${row.custom_paper_type}, ${row.custom_print}, ${row.custom_length}, ${row.custom_width}, ${row.custom_height}`;
  //       desc = __(desc);
  //       frappe.model.set_value(
  //         row.doctype,
  //         row.name,
  //         "custom_product_description",
  //         desc
  //       );
  //     }
  //   });
  // },
});

frappe.ui.form.on("Quotation Item", {
  // custom_layers(frm, cdt, cdn) {
  //   var row = locals[cdt][cdn];

  //   filterChildFields(
  //     frm,
  //     "items",
  //     "custom_layers",
  //     "layers",
  //     "custom_additional_services"
  //   );
  //   frm.refresh_field("items");
  // },
  // custom_cover_type(frm, cdt, cdn) {
  //   var row = locals[cdt][cdn];

  //   filterCoverFields(
  //     frm,
  //     "items",
  //     "custom_cover_type",
  //     "cover_type",
  //     "custom_cover_size"
  //   );
  //   frm.refresh_field("items");
  // },

  item_code(frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    row.custom_layers = null;
    row.custom_additional_services = null;
    row.custom_plastic_types = null;
    row.custom_size = null;
    row.custom_product_description = null;
    row.custom_length = null;
    row.custom_width = null;
    row.custom_height = null;
    row.custom_variables = null;
    row.custom_bolt_cover_type = null;
    row.custom_plastic_cover_type = null;
    row.custom_product = null;
    row.custom_service = null;
    row.custom_limitations = null;
    row.custom_print = null;
    row.custom_grams = null;
    row.custom_shape_paper_type = null;
    row.custom_paper_type = null;
    row.custom_product_description;
    frm.refresh_field("items");
  },
});

// filter function for child table fields
function filterChildFields(
  frm,
  tableName,
  fieldTrigger,
  fieldName,
  fieldFiltered
) {
  frm.fields_dict[tableName].grid.get_field(fieldFiltered).get_query =
    function (doc, cdt, cdn) {
      var child = locals[cdt][cdn];
      if (child[fieldTrigger] == "SW") {
        return {
          filters: [[fieldName, "=", child[fieldTrigger]]],
        };
      }
    };
}

function filterPlasticFields(
  frm,
  tableName,
  fieldTrigger,
  fieldName,
  fieldFiltered
) {
  frm.fields_dict[tableName].grid.get_field(fieldFiltered).get_query =
    function (doc, cdt, cdn) {
      var child = locals[cdt][cdn];
      if (child[fieldTrigger]) {
        return {
          filters: [[fieldName, "=", "Plastic"]],
        };
      }
    };
}

// funtion to clear fields if item code is changed
frappe.ui.form.on("Quotation Item", {
  item_code(frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    row.custom_layers = null;
    row.custom_additional_services = null;
    row.custom_plastic_types = null;
    row.custom_size = null;
    frm.refresh_field("items");
  },
});

function filterCoverFields(
  frm,
  tableName,
  fieldTrigger,
  fieldName,
  fieldFiltered
) {
  frm.fields_dict[tableName].grid.get_field(fieldFiltered).get_query =
    function (doc, cdt, cdn) {
      var child = locals[cdt][cdn];
      if (child[fieldTrigger]) {
        return {
          filters: [[fieldName, "=", child[fieldTrigger]]],
        };
      }
    };
}
