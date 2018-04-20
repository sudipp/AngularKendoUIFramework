
(function () {

    'use strict';

    spApp.factory('spGridDemoDataSource',
    [
        'AppStartupService', '$http', 'spGridDemoModel', function (AppStartupService, $http, spGridDemoModel) {

            var crudServiceBaseUrl = "https://demos.telerik.com/kendo-ui/service";

            var spGridDemoDataSource = function () {

                //keep self reference
                var self = this;
                //input for kendo data source
                this.input = {};

                this.Data = new kendo.data.DataSource({
                    
                    transport: {
                        create: {
                            url: crudServiceBaseUrl + "/Products/Create",
                            dataType: "jsonp"
                        },
                        read: {
                            url: crudServiceBaseUrl + "/Products",
                            dataType: "jsonp"
                        },
                        update: {
                            url: crudServiceBaseUrl + "/Products/Update",
                            dataType: "jsonp"
                        },
                        destroy: {
                            url: crudServiceBaseUrl + "/Products/Destroy",
                            dataType: "jsonp"
                        },
                        parameterMap: function(options, operation) {
                            if (operation !== "read" && options.models) {
                                return {models: kendo.stringify(options.models)};
                            }
                        }
                        /*parameterMap: function (data, operation) {
                            switch (operation) {
                                case "read":
                                    return JSON.stringify(self.input);
                                    break;
                                case
                                "create":
                                    return JSON.stringify(data);
                                    break;
                                case
                                "update":
                                    return JSON.stringify(data);
                                    break;
                                case
                               "destroy":
                                    return JSON.stringify(data);
                                    break;
                            }
                        }*/
                    },
                    batch: false,
                    pageSize: AppStartupService.settings.gridPageSize,
                    schema: {
                        data: function (data) {
                            var dbdata = data.map(function (dataRow) {
                                return angular.merge({}, dataRow, { IsSelectable: true });
                            });
                            return dbdata;
                        },
                        total: function (data) {
                            return data.length;
                        },
                        model: spGridDemoModel
                    }
                });
            };

            spGridDemoDataSource.prototype.setInput = function (inputParam) {
                this.input = inputParam;
            };
            
            return spGridDemoDataSource;
        }]);

})();