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
  
      return Controller.extend("ui5.walkthrough.controller.Shipper", {
        formatter: formatter,
  
        onInit() {
          const oViewModel = new JSONModel({ currency: "EUR" });
          this.getView().setModel(oViewModel, "view");
  
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("shipper").attachPatternMatched(this.onObjectMatched, this);
        },
    
});
}
);