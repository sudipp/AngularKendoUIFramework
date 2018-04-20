
(function () {
    'use strict';

    spApp.factory('spGridDemoModel', function (AppStartupService) {

        return kendo.data.Model.define({
            id: "ProductID",
            fields: {
                ProductID: { editable: false, nullable: true },
                ProductName: { validation: { required: true } },
                UnitPrice: { type: "number", validation: { required: true, min: 1} },
                Discontinued: { type: "boolean" },
                UnitsInStock: { type: "number", validation: { min: 0, required: true } }
            }
        });
    });
})();