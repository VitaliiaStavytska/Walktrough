sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/model/json/JSONModel","sap/m/MessageToast",
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'sap/ui/model/Sorter'],
  (Controller, History, JSONModel,MessageToast, Filter, FilterOperator, Sorter) => {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Product", {
      onInit() {
        const oViewModel = new JSONModel({ currency: "EUR" });
        this.getView().setModel(oViewModel, "view");

        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("product").attachPatternMatched(this.onObjectMatched, this);
      },
      onObjectMatched(oEvent) {
        this.getView().byId("product").setBusy(true);

        const oID = oEvent.getParameter("arguments").product;
        const oModel = this.getView().getModel("invoices");
        oModel.read(`/Products(${oID})`, {
          urlParameters: { $expand: "Supplier,Category" },
          success: (data) => {
            let oModel = new JSONModel(data);
            this.getView().setModel(oModel, "product");
            this.getView().byId("product").setBusy(false);
          },
          error: (err) => {
            console.log(err);
            this.getView().byId("product").setBusy(false);
          },
          onPress(oEvent) {
            const oID = oEvent.getSource().getBindingContext("invoices").getObject().OrderID;
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("detail", { order: oID });
          },

          onSliderMoved: function (oEvent) {
            var iValue = oEvent.getParameter("value");
            this.byId("otbSubheader").setWidth(iValue + "%");
            this.byId("otbFooter").setWidth(iValue + "%");
          }
        });
      },
    
      onPress(oEvent) {
        const oID = oEvent.getSource().getBindingContext("products").getObject().ProductID;
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("product", { product: oID });
      },
      handleSelectChange: function(oEvent) {
        var oTree = this.getView().byId("ProductID").getList();
        oTree.setMode(oEvent.getParameter("selectedItem").getKey());
      },

      onOpenProductDetails() {
        this.oDialog.loadFragment({ name: "ui5.walkthrough.view.dialogs.Product" });
        this.oDialog.open();
      },
      onCloseProductDetails() {
        this.oDialog.close();
      },


      handleMessageToastPress: function(oEvent) {
        var msg = 'Choose from the List';
        MessageToast.show(msg);
      },
      

		  _fnGroup : function (oContext){
			var sSupplierName = oContext.getProperty("SupplierID");

			return {
				key : sSupplierName,
				text : sSupplierName
			};
		},

		onReset: function (oEvent){
			this.bGrouped = false;
			this.bDescending = false;
			this.sSearchQuery = 0;
			this.byId("maxPrice").setValue("");

			this.fnApplyFiltersAndOrdering();
		},
  
		onFilter: function (oEvent) {
			this.sSearchQuery = oEvent.getSource().getValue();
			this.fnApplyFiltersAndOrdering();
		},

		onTogglePress: function(oEvent) {
			var oButton = oEvent.getSource(),
				bPressedState = oButton.getPressed(),
				sStateToDisplay = bPressedState ? "Pressed" : "Unpressed";

			MessageToast.show(oButton.getId() + " " + sStateToDisplay);
		},

    fnApplyFiltersAndOrdering: function (oEvent){
			var aFilters = [],
				aSorters = [];

			if (this.bGrouped) {
				aSorters.push(new Sorter("SupplierID", this.bDescending, this._fnGroup));
			} else {
				aSorters.push(new Sorter("CategoryID", this.bDescending));
			}

			if (this.sSearchQuery) {
				var oFilter = new Filter("SupplierID", FilterOperator.Contains, this.sSearchQuery);
				aFilters.push(oFilter);
			}

			this.byId("idProductsTable").getBinding("rows").filter(aFilters).sort(aSorters);
		},
		onPDFAction: function(oEvent) {
      var msg = 'Action triggered on item';
      MessageToast.show(msg);
    },
      onBack() {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) window.history.go(-1);
        else {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("homepage", {}, true);
        }
      },
      onShipper() {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("shipper", {}, true);
        
      },
      
      onHomepage() {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("homepage", {}, true);
        
      },
      
      onDetail() {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("detail", {}, true);
        
      },

      onPress(oEvent) {
        const oID = oEvent.getSource().getBindingContext("invoices").getObject().SupplierID;
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("shipper", { order: oID });
      }
    });
  }
);
