sap.ui.define([], () => {
	"use strict";

	return {
		statusText(sStatus) {
			const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			switch (sStatus) {
				case "A":
					return oResourceBundle.getText("invoiceStatusA");
				case "B":
					return oResourceBundle.getText("invoiceStatusB");
				case "C":
					return oResourceBundle.getText("invoiceStatusC");
				default:
					return sStatus;
			}
		},
		formatPhoto: function (photo) {
			const oReutrn = "data:image/png;base64," + photo.substring(104);
			return oReutrn;
		  }
	};
});