
//this global variable is required to use in edit kendo template
var EditingProhibited = false;
var selectedRequest = null;

(function () {

    'use strict';

    spApp.controller('spGridDemoController', ['$scope', '$http', 'AppStartupService', 'spGridDemoDataSource', 'MessageService', '$window', '$timeout',
        function ($scope, $http, AppStartupService, spGridDemoDataSource, MessageService, $window, $timeout) {

            $scope.addTemplateUrl = "/Views/spGridDemo/add.html";
            $scope.editTemplateUrl = "/Views/spGridDemo/edit.html";

            $scope.ArchivedIncluded = false;
            $scope.EditingProhibited = false;
            
            var searchCritera = {
                ArchivedIncluded: $scope.ArchivedIncluded,
                Role: AppStartupService.crntRole()
            };
            $scope.requestDS = new spGridDemoDataSource();
            $scope.requestDS.setInput(searchCritera);
            
            $scope.grdOptions = {
                resizable: true,
                sortable: true,
                scrollable: true,
                selectable: true,
                filterable: true,
                pageable: true,
                autoBind: true,
                excel: {
                    fileName: "spGridDemoGridName.xlsx",
                    filterable: true,
                    allPages: true,
                    exportGrdNm: "spGridDemoGridName"
                },
                selectableColumn: {
                    show: true,
                    singleMode: true,
                    checked: true
                },
                AfterFilter: function (e) { },
                RowSelected: function (e) {
                    if (e.selected) {

                        selectedRequest = e.model;
                        e.sender.EditSelectedRows();
                        
                        $timeout(function () {
                            $('#eqgeditform_spGridDemoGridName')[0].scrollIntoView();
                        }, 0, false);

                    } else {
                        selectedRequest = null;

                        e.sender.CancelEdit();
                    }
                },
                dataBound: function () {},
                dataSource: $scope.requestDS.Data,
                columns: [
                    { field:"ProductName", title: "Product Name", width: 220 },
                    { field: "UnitPrice", title:"Unit Price", format: "{0:c}", width: 120 },
                    { field: "UnitsInStock", title:"Units In Stock", width: 120 },
                    { field: "Discontinued", width: 120 }//, editor: $scope.customBoolEditor }
                ]
            };
            $scope.grdCrudOptions = {
                add: {
                    templateFile: $scope.addTemplateUrl,
                    windowTile: "Add : Product",
                    successText: MessageService.messages.info.I029
                },
                edit: {
                    recordLimit: 1,
                    templateFile: $scope.editTemplateUrl,
                    recordLimitViolationText: 'Only 1 rows may be updated at a time. Deselect some rows and try again.',
                    windowTile: "Edit : Product",
                    successText: MessageService.messages.info.I030
                },
                destroy: {
                    recordLimit: 1,
                    recordLimitViolationText: "Only 1 rows may be deleted at a time. Deselect some rows and try again.",
                    successText: MessageService.messages.info.I031
                },
                width: 1400,
                height: 350,
                editMode: "form"
            };
            $scope.grdToolbarOptions = {
                gridHeaderText: 'Grid Header',
                showExport: true,
                search: {
                    show: true,
                    panelExpanded: false,
                    templateFile: "/Views/spGridDemo/search.html",
                    open: function (e) {
                        var grid = AppStartupService.getDirective("sp-grid", "spGridDemoGridName").scope.eqgGrid;
                        grid.CancelEdit(true);
                        //hide selectable column
                        grid.options.selectableColumn.show = false;
                    },
                    close: function (e) {
                        var grid = AppStartupService.getDirective("sp-grid", "spGridDemoGridName").scope.eqgGrid;
                        //show selectable column
                        grid.options.selectableColumn.show = true;
                    }
                },
                showGridFiltersummary: true,
                showClearGridFilter: true
            };


            $scope.CancelChanges = function () {

                if ($scope.isViewDirty()) {
                    if (!confirm(MessageService.messages.wanring.W019)) { return; }
                }
                var grid = AppStartupService.getDirective("sp-grid", "spGridDemoGridName").scope.eqgGrid;
                grid.CancelEdit(true);
            };

            $scope.NewRequest = function (e) {
                var grid = AppStartupService.getDirective("sp-grid", "spGridDemoGridName").scope.eqgGrid;
                grid.AddRow();

                selectedRequest = $scope.getCurrentDirtyModel();

                $timeout(function () {
                    $('#eqgeditform_spGridDemoGridName')[0].scrollIntoView();
                }, 0, false);
            }

            $scope.DeleteRequest = function (e) {
                if (confirm(MessageService.messages.wanring.W055)) {
                    var grid = AppStartupService.getDirective("sp-grid", "spGridDemoGridName").scope.eqgGrid;
                    grid.DeleteSelectedRows().then(function successCallback() { }
                        , function errorCallback(response) {
                            grid.dataSource.cancelChanges();
                        });
                }
            };
 
            $scope.SaveRequest = function (e) {

                var grid = AppStartupService.getDirective("sp-grid", "spGridDemoGridName").scope.eqgGrid;
                if (grid.dirtyRecords().length > 0) {

                    var gridScope = AppStartupService.getDirective("sp-grid", "spGridDemoGridName").scope;
                    gridScope.UpdateChanges(e).then(function successCallback() {
                    }, function (e) {
                    });
                }
            };

            $scope.getCurrentDirtyModel = function (e) {

                if (AppStartupService.getDirective("sp-grid", "spGridDemoGridName").scope !== undefined) {
                    var grid = AppStartupService.getDirective("sp-grid", "spGridDemoGridName").scope.eqgGrid;
                    if (grid != undefined && grid.dirtyRecords().length > 0) {
                        return grid.dirtyRecords()[0];
                    } else if (grid != undefined && grid.$angular_scope.selectedRowPKIds.idArray().length) {
                        return grid.dataSource.get(grid.$angular_scope.selectedRowPKIds.idArray()[0]);
                    }
                }
            };

            $scope.isViewDirty = function () {
                var grid = AppStartupService.getDirective("sp-grid", "spGridDemoGridName").scope.eqgGrid;
                return grid.dataSource.hasChanges();
            };
            $scope.isDeleteble = function () {
                var model = $scope.getCurrentDirtyModel();
                if (model != undefined)
                    return true;
                return false;
            };
            
            $scope.isSaveable = function () {
                var model = $scope.getCurrentDirtyModel();
                if (model != undefined && $scope.isViewDirty())
                    return true;
                return false;
            };
            $scope.canAddRequest = function () {
                var dirtyModel = $scope.getCurrentDirtyModel();
                if (dirtyModel === undefined)
                    return true;
                return false;
            };


            $scope.isCancelable = function () {
                var model = $scope.getCurrentDirtyModel();
                if (model != undefined && $scope.isViewDirty())
                    return true;
                return false;
            };


        }]);
})();



