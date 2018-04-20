
(function () {

    'use strict';
    
    spApp.controller('spGridDemoSearchController', ['$scope', '$http', 'AppStartupService', 
        function ($scope, $http, AppStartupService) {

            $scope.ArchivedIncluded = $scope.$parent.$parent.$parent.$parent.$parent.ArchivedIncluded;

            $scope.SearchRequest = function (e) {
                var gridDirectiveScope = AppStartupService.getDirective("sp-grid", "spGridDemoGridName").scope;
                var refRequestController = gridDirectiveScope.$parent.$parent;

                var searchCritera = {
                    ArchivedIncluded: $scope.ArchivedIncluded,
                    Role: AppStartupService.crntRole()
                };

                //setting parent's ArchivedIncluded
                $scope.$parent.$parent.$parent.$parent.$parent.ArchivedIncluded = $scope.ArchivedIncluded;

                AppStartupService.clearMessage();

                refRequestController.requestDS.setInput(searchCritera);
                gridDirectiveScope.eqgGrid.dataSource.read();
            };

            $scope.CloseSearchRequest = function (e) {
                var gridDirectiveScope = AppStartupService.getDirective("sp-grid", "spGridDemoGridName").scope;
                gridDirectiveScope.closeSearch(e);
            };
        }]);
})();

