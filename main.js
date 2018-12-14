﻿angular.module('app', [
    'cloudant-query-builder'
])

.constant('APP_VERSION', cloudant_query_builder_version)

.config(['$httpProvider', '$logProvider', 'DemoDataProvider', function ($httpProvider, $logProvider, DemoDataProvider) {

    $logProvider.debugEnabled(true);

    var interceptor = ['$rootScope', '$q', '$location', function ($rootScope, $q, $location) {

        var demoData = DemoDataProvider.$get();

        return {
            'request': function (request) {
                if (request.url.indexOf("https://localhost/aqb/typeahead/object-types/") > -1 ||
                    request.url.indexOf("https://localhost/aqb/typeahead/fma/") > -1 ||
		    request.url.indexOf("https://localhost/aqb/typeahead/bool/") > -1) {
                    request.timeout = 1;
                }
                return request;
            },
            'responseError': function (response) {
                if (response.config.url.indexOf("https://localhost/aqb/typeahead/object-types/") > -1) {
                    // Some object types returned by the typeahead
                    response.data = demoData.getObjectTypes();
                    response.status = 200;
                } else if (response.config.url.indexOf("https://localhost/aqb/typeahead/fma/") > -1) {
                    // Some FMA terms returned by the typeahead
                    response.data = demoData.getFMATerms();
                    response.status = 200;
                } else if (response.config.url.indexOf("https://localhost/aqb/typeahead/bool/") > -1) {
		    response.data = demoData.getBoolTypes();
		    response.status = 200;
		}
                return response;
            }
        };
    }];
    $httpProvider.interceptors.push(interceptor);
}])

.controller('MainController', ['$scope', '$sce', '$log', 'APP_VERSION', 'AppConfig', 'DemoData', function ($scope, $sce, $log, APP_VERSION, AppConfig, DemoData) {

    $scope.appName = "Restful";
    if (typeof getAppName === "function") $scope.appName = getAppName();
    
    $scope.appVersion = APP_VERSION;

    AppConfig.setMaxGroups(4);
    AppConfig.setMaxConditions(4);

    $scope.jsonOutput = {};

    $scope.search = function (form, $event) {
        $log.debug($scope.searchContainer);
        $scope.jsonOutput = JSON.stringify($scope.searchContainer, null, 4);
    };

    $scope.$watch("searchContainer", function () {
        $scope.jsonOutput = {};
        var groups = $scope.searchContainer.groups;
        if (!!groups && groups instanceof Array && groups.length > 0) {
            $scope.output = $sce.trustAsHtml(computeOutput(groups[0]));
        }
    }, true);

    function computeOutput(group) {
	return renderRestfulQuery(group);
    }

    $scope.sourceTypes = DemoData.getSourceTypes();

    $scope.logicalOperators = DemoData.getLogicalOperators();

    var emptySearchContainer = {
        "groups": [
            {
                "conditions": [
                    {}
                ]
            }
        ]
    };
    //$scope.searchContainer = emptySearchContainer;
    $scope.searchContainer = DemoData.getSearchContainer1();
}])

.provider('DemoData', function DemoDataProvider() {

    function DemoData() {
        this.getBoolTypes = function () {
            return [
                {
                    "data": "True",
                    "displayName": "true"
                },
                {
                    "data": "False",
                    "displayName": "false"
                }
            ];
        };
        this.getObjectTypes = function () {
            return [
                {
                    "data": "Subject",
                    "displayName": "Subject"
                },
                {
                    "data": "Study",
                    "displayName": "Study"
                },
                {
                    "data": "RawImage",
                    "displayName": "Raw Image"
                },
                {
                    "data": "SegmentationImage",
                    "displayName": "Segmentation Image"
                },
                {
                    "data": "ClinicalStudyData",
                    "displayName": "Clinical Study Data"
                },
                {
                    "data": "ClinicalStudyDefinition",
                    "displayName": "Clinical Study Definition"
                },
                {
                    "data": "StatisticalModel",
                    "displayName": "Statistical Model"
                },
                {
                    "data": "GenomicData",
                    "displayName": "Genomic Data"
                },
                {
                    "data": "GenomicSeries",
                    "displayName": "Genomic Series"
                },
                {
                    "data": "GenomicPlatform",
                    "displayName": "Genomic Platform"
                }
            ];
        };
        this.getFMATerms = function () {
            return [
                {
                    "data": "3734",
                    "displayName": "Aorta"
                },
                {
                    "data": "3740",
                    "displayName": "Bulb of aorta"
                },
                {
                    "data": "7195",
                    "displayName": "Lung"
                },
                {
                    "data": "7203",
                    "displayName": "Kidney"
                },
                {
                    "data": "50801",
                    "displayName": "Brain"
                }
            ];
        };
        this.getSourceFields = getSourceFields;
	this.getFirmFields = getFirmFields;
	this.getSourceTypes = getSourceTypes;
        this.getLogicalOperators = function () {
            return [
                {
                    "name": "And",
                    "displayName": "AND",
                    "position": 1
                },
                {
                    "name": "Or",
                    "displayName": "OR",
                    "position": 2
                }
            ];
        };
        this.getSearchContainer1 = function () {
            return {
                "groups": [
                    {
                        "logicalOperator": {
                            "name": "And",
                            "displayName": "AND"
                        },
                        "sourceType": {
                            "name": "FirmStats",
                            "displayName": "foo Objects"
                        },
                        "conditions": [
                             {
                                 "sourceField": {
                                     "name": "retail",
				     "displayName": "retail"
                                 },
                                 "comparisonOperator": {
                                     "name": ":",
				     "displayName": ":",
				     "queryText": ":"
                                 },
                                 "inputItem": {
                                     "data": "true",
                                     "displayName": "true",
                                     "isTypeahead": true
                                 }
                             }
                        ],
                        "groups": [
                            {
                                "logicalOperator": {
                                    "name": "And",
                                    "displayName": "AND"
                                },
                                "sourceType": {
                                    "name": "Advisors",
                                    "displayName": "foo advisors"
                                },
                                "conditions": [
                                     {
                                         "sourceField": {
                                             "name": "AnatomicalRegion",
                                             "displayName": "Anatomical Region"
                                         },
                                         "comparisonOperator": {
                                             "name": "Equals",
                                             "displayName": "="
                                         },
                                         "inputItem": {
                                             "data": "7203",
                                             "displayName": "Kidney",
                                             "isTypeahead": true
                                         }
                                     },
                                     {
                                         "sourceField": {
                                             "name": "Type",
                                             "displayName": "Type"
                                         },
                                         "comparisonOperator": {
                                             "name": "Equals",
                                             "displayName": "="
                                         },
                                         "inputItem": {
                                             "data": "RawImage",
                                             "displayName": "Raw Image",
                                             "isTypeahead": true
                                         }
                                     },
                                     {
                                         "sourceField": {
                                             "name": "Type",
                                             "displayName": "Type"
                                         },
                                         "comparisonOperator": {
                                             "name": "Equals",
                                             "displayName": "="
                                         },
                                         "inputItem": {
                                             "data": "ClinicalStudyData",
                                             "displayName": "Clinical Study Data",
                                             "isTypeahead": true
                                         }
                                     }
                                ]
                            }
                        ]
                    }
                ]
            };
        }
    }

    this.$get = function demoDataFactory() {
        return new DemoData();
    };
});
