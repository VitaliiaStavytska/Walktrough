sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel", "sap/ui/Device"],
  (UIComponent, JSONModel, Device) => {
    "use strict";

    return UIComponent.extend("ui5.walkthrough.Component", {
      metadata: {
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
        manifest: "json"
      },

      init() {
        UIComponent.prototype.init.apply(this, arguments);

        const oDeviceModel = new JSONModel(Device);
        oDeviceModel.setDefaultBindingMode("OneWay");
        this.setModel(oDeviceModel, "device");

        this.getRouter().initialize();
      },
      getContentDensityClass() {
        return Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact";
      }
    });
  }
);
