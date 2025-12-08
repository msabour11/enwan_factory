frappe.ui.form.on("Quotation", {
  //   refresh(frm) {
  //     // frm.fields_dict["items"].grid.get_field(
  //     //   "custom_additional_services"
  //     // ).get_query = function (doc, cdt, cdn) {
  //     //   let row = locals[cdt][cdn];
  //     //   return {
  //     //     filters: {
  //     //       layers: row.custom_layers,
  //     //     },
  //     //   };
  //     // };
  //   },
  refresh(frm) {
    // add material request button
    frm.add_custom_button(__("Material Request"), function () {
      frappe.model.open_mapped_doc({
        method: "enwan_factory.api.api.make_material_request",
        frm: frm,
      });
    });

    filterChildFields(
      frm,
      "items",
      "custom_layers",
      "layers",
      "custom_additional_services"
    );
    filterCoverFields(
      frm,
      "items",
      "custom_cover_type",
      "cover_type",
      "custom_cover_size"
    );
  },
});

frappe.ui.form.on("Quotation Item", {
  custom_layers(frm, cdt, cdn) {
    var row = locals[cdt][cdn];

    filterChildFields(
      frm,
      "items",
      "custom_layers",
      "layers",
      "custom_additional_services"
    );
    frm.refresh_field("items");
  },
  custom_cover_type(frm, cdt, cdn) {
    var row = locals[cdt][cdn];

    filterCoverFields(
      frm,
      "items",
      "custom_cover_type",
      "cover_type",
      "custom_cover_size"
    );
    frm.refresh_field("items");
  },
  // make filter for plastic types based on selected plastic
  // custom_plastic_types(frm, cdt, cdn) {
  //   var row = locals[cdt][cdn];

  //   filterPlasticFields(
  //     frm,
  //     "items",
  //     "custom_plastic_types",
  //     "size_type",
  //     "custom_size"
  //   );
  //   frm.refresh_field("items");
  // },
  item_code(frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    row.custom_layers = null;
    row.custom_additional_services = null;
    row.custom_plastic_types = null;
    row.custom_size = null;
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
