sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  (Controller, JSONModel, formatter, Filter, FilterOperator, Sorter, MessageToast) => {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Homepage", {
      formatter: formatter,

      onInit() {
        const oViewModel = new JSONModel({ currency: "EUR" });
        this.getView().setModel(oViewModel, "view");

        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("homepage").attachPatternMatched(this.onObjectMatched, this);
      },

      onObjectMatched() {
        this.getView().byId("invoices").setBusy(true);

        const oModel = this.getView().getModel("invoices");
        oModel.read("/Invoices", {
          success: (data) => {
            const oModel = new JSONModel();
            const aCountries = [...new Set(data.results.map((item) => item.Country))];
            aCountries.sort();
            oModel.setData(aCountries);
            this.getView().setModel(oModel, "allCountries");
            this.getView().byId("invoices").setBusy(false);
          },
          error: (err) => {
            console.log(err);
            this.getView().byId("invoices").setBusy(true);
          }
        });
      },

      onFilter() {
        const search = this.getView().byId("search");
        const select = this.getView().byId("select");

        let orFilters = [];
        if (search.getValue()) {
          orFilters.push(new Filter("ProductName", FilterOperator.Contains, search.getValue()));
          orFilters.push(new Filter("ShipperName", FilterOperator.Contains, search.getValue()));
        }

        let andFilters = [];
        if (select.getSelectedKey()) {
          andFilters.push(new Filter("Country", FilterOperator.EQ, select.getSelectedKey()));
        }

        if (orFilters.length > 0) {
          andFilters.push(new Filter(orFilters, false));
        }

        const oList = this.getView().byId("invoiceList");
        const oBinding = oList.getBinding("items");
        oBinding.filter(new Filter(andFilters, true));
      },

      onReset() {
        const search = this.getView().byId("search");
        const select = this.getView().byId("select");

        search.setValue("");
        select.setSelectedKey("");

        const oList = this.getView().byId("invoiceList");
        const oBinding = oList.getBinding("items");
        oBinding.filter([]);
      },
      onGroupA: function (oEvent){
        this.bGrouped = !this.bGrouped;
        this.fnApplyFiltersAndOrdering();
      },
  
      onSortA: function (oEvent) {
        this.bDescending = !this.bDescending;
        this.fnApplyFiltersAndOrdering();
      },

      onPDFActionA: function(oEvent) {
        var msg = 'Action triggered on item';
        MessageToast.show(msg);
      },

		  onTogglePressA: function(oEvent) {
			var oButton = oEvent.getSource(),
				bPressedState = oButton.getPressed(),
				sStateToDisplay = bPressedState ? "Pressed" : "Unpressed";

			MessageToast.show(oButton.getId() + " " + sStateToDisplay);
		},

      onPress(oEvent) {
        const oID = oEvent.getSource().getBindingContext("invoices").getObject().OrderID;
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("detail", { order: oID });
      }
    });
  }
);
