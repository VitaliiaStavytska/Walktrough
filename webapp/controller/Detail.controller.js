sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/model/json/JSONModel"],
  (Controller, History, JSONModel) => {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Detail", {
      onInit() {
        const oViewModel = new JSONModel({ currency: "EUR" });
        this.getView().setModel(oViewModel, "view");

        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
      },

      async onObjectMatched(oEvent) {
        this.getView().byId("details").setBusy(true);

        const oID = parseInt(oEvent.getParameter("arguments").order);
        const oMainModel = this.getView().getModel("invoices");
        oMainModel.read(`/Orders(${oID})`, {
          urlParameters: { $expand: "Employee,Customer,Order_Details,Shipper" },
          success: (data) => {
            let oModel = new JSONModel(data);
            this.getView().setModel(oModel, "details");
          },
          error: (err) => {
            console.log(err);
            this.getView().byId("details").setBusy(false);
          }
        });

        this.aProducts = [];

        await oMainModel.read(`/Orders(${oID})/Order_Details`, {
          urlParameters: { $expand: "Product" },
          success: (data) => {
            this.getProducts(data.results);
          },
          error: (err) => {
            console.log(err);
            this.getView().byId("details").setBusy(false);
          }
        });
      },
      async getProducts(aProducts) {
        const oMainModel = this.getView().getModel("invoices");
        const oModel = new JSONModel();
        this.getView().setModel(oModel, "products");

        aProducts.forEach(async product => {
          await oMainModel.read(`/Products(${product.ProductID})`, {
            urlParameters: { $expand: "Supplier" },
            success: (data) => {
              let aData = oModel.getData();
              if (typeof aData === "object" && !Array.isArray(aData)) {
                let newData = [data];
                oModel.setData(newData)
              }
              else {
                aData.push(data);
                oModel.setData(aData)
                this.getView().byId("details").setBusy(false);
              }
            },
            error: (err) => {
              console.log(err)
              this.getView().byId("details").setBusy(false);
            }
          })
        });
      },
      async onOpenCustomerDetails() {
        this.oDialog ??= await this.loadFragment({ name: "ui5.walkthrough.view.dialogs.Customer" });
        this.oDialog.open();
      },
      onCloseCustomerDetails() {
        this.oDialog.close();
      },
      onTabSelect(oEvent) {
        const sKey = oEvent.getParameter("key");
        const oEmployee = this.getView().byId("EmployeeCard");
        const oShipper = this.getView().byId("ShipperCard");
        const oCustomer = this.getView().byId("CustomerCard");

        if (sKey === "shipping") {
          oShipper.setVisible(true);
          oEmployee.setVisible(false);
          oCustomer.setVisible(false);

        }
        else if (sKey === "processor") {
          oEmployee.setVisible(true);
          oShipper.setVisible(false);
          oCustomer.setVisible(false);

        }
        else if (sKey === "customer") {
          oCustomer.setVisible(true);
          oShipper.setVisible(false);
          oEmployee.setVisible(false);
        }
      },
      test(foto) {
        console.log(foto);
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
      onPress(oEvent) {
        const oID = oEvent.getSource().getBindingContext("products").getObject().ProductID;
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("product", { product: oID });
      }
    });
  }
);
