angular.module('itsEasyApp').controller('ItsEasyController', ['$scope', '$rootScope', '$http', 'ItsEasyApiService', 'UtilityService', 'toastr', '$uibModal', '$timeout', function($scope, $rootScope, $http, ItsEasyApiService, UtilityService, toastr, $uibModal, $timeout) {

  $scope.isBusy = false;

  $scope.dealers = [];
  $scope.corps = [];
  $scope.jobs = [];

  $scope.all_dealers = [];
  $scope.all_corps = [];
  $scope.all_jobs = [];

  $scope.search = {};

  $scope.selected_jobs = [];
  $scope.current_dealer = undefined;
  $scope.current_corp = undefined;
  $scope.current_job = undefined;

  $scope.showEntriesCount = false;

  $scope.all_selected = {};
  $scope.active_user = { name: "" };
  $scope.selected_sheet = { name: "" };
  $scope.created_sheet = undefined;
  $scope.created_sheet_name = { txt: "" };
  $scope.printableSheets = undefined;

  $scope.dateOptions = {
    dateDisabled: function(data) {
      var date = data.date,
        mode = data.mode;
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    },
    formatYear: 'yy',
    maxDate: new Date(2050, 5, 22),
    minDate: new Date(1920, 1, 1),
    startingDay: 1
  };
  $scope.dateFormat = 'MM-dd-yyyy';

  $scope.jobDatePickers = {
    date: { opened: false },
    date_sent: { opened: false },

    primary_dob: { opened: false },

    coowner_dob: { opened: false },

    vehicle_lease_cancel_date: { opened: false },
    vehicle_lease_sign_date: { opened: false },
    vehicle_purchase_date: { opened: false }
  };
  $scope.openDatePicker = function(item) {
    $scope.jobDatePickers[item].opened = true;
  };

  $scope.getAll = function() {

    ItsEasyApiService.getAll(function(successResp) {

      ['dealers', 'corps', 'jobs', 'sheets'].forEach(function(item) {

        if (item === "sheets") {

          if (item === "sheets" && successResp && successResp.data.sheets) {

            $scope.printableSheets = successResp.data.sheets.filter(function(sheet) {
              var createdOn = new Date(sheet.created_at),
                today = new Date();
              return (createdOn.getDate() == today.getDate() &&
                createdOn.getMonth() == today.getMonth() &&
                createdOn.getFullYear() == today.getFullYear());
            });
          }

          return;
        }

        if (item === "jobs" && successResp && successResp.data.jobs) {

          successResp.data.jobs.forEach(function(job) {

            if (job.dealer_id && job.dealer_id.length) {
              job.dealer = $scope.all_dealers.filter(function(dealer) {
                return (job.dealer_id === dealer._id);
              })[0];
            }

            job.last_name_table = (job.primary_last_name && job.primary_last_name.length) ? job.primary_last_name : job.primary_company;
          });
        }

        $scope[item] = successResp.data && successResp.data[item];
        $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));

        $scope.updateTables(item);
      });

      $scope.showEntriesCount = $scope.tables[$scope.activeView].current_page_data.length <= $scope.tables[$scope.activeView].total_items;

    }, function(errorResp) {});
  };
  $scope.getAll();

  $scope.updateTables = function(item) {

    $scope.tables[item].current_page_data = $scope.getCurrentPageData(item);
    $scope.tables[item].total_items = $scope[item].length;
    $scope.tables[item].has_next_data = $scope.dataExists(item, 'next');
    $scope.tables[item].has_prev_data = $scope.dataExists(item, 'prev');
  };

  $scope.create = function(item) {

    if ($scope.isBusy) {
      return;
    }

    $scope.isBusy = true;

    ItsEasyApiService.create(item, $scope['current_' + item], function(successResp) {

      $scope.isBusy = false;

      /*$timeout(function() {
        $scope.isBusy = false;
      }, 500);*/

      $scope[item + 's'].unshift(successResp.data);
      $scope['current_' + item] = $scope[item + 's'][0];

      // Here must restart showing items since they are showing from tables.jobs.current_page_data not from $scope[item + 's']
      $scope.tables[item + 's'].current_page = 1;

      $scope.pageChanged(item + 's');

      if ($scope.activeView === "jobs" && item !== 'job') {

        $scope.updateIdsOnCurrentJob(successResp.data._id);
        $scope.formSubmitted('job');

      } else {
        toastr.success(item + ' created!');
      }

    }, function(errorResp) {
      $scope.isBusy = false;
      toastr.error('Error while creating ' + item);
    });
  };

  $scope.save = function(item) {

    var currentObj = $scope['current_' + item];

    if ($scope.isBusy) {
      return;
    }

    $scope.isBusy = true;

    ItsEasyApiService.update(currentObj._id, item, currentObj, function(successResp) {

      $scope.isBusy = false;

      /*$timeout(function() {
        $scope.isBusy = false;
      }, 500);*/

      var idxToUpdate;

      $scope[item + 's'].forEach(function(obj, idx) {
        if (obj._id === successResp.data._id) {
          idxToUpdate = idx;
        }
      });

      $scope[item + 's'][idxToUpdate] = successResp.data;
      $scope['current_' + item] = $scope[item + 's'][idxToUpdate];

      if ($scope.activeView === "jobs" && item !== 'job') {

        $scope.updateIdsOnCurrentJob(successResp.data._id);
        $scope.formSubmitted('job');

      } else {
        toastr.success(item + ' updated!');
      }

    }, function(errorResp) {
      $scope.isBusy = false;
      toastr.error('Error while updating ' + item);
    });
  };

  $scope.remove = function(item) {

    var currentObj = $scope['current_' + item],
      idxToDelete;

    if ($scope.isBusy) {
      return;
    }

    $scope[item + 's'].forEach(function(obj, idx) {
      if (obj._id === currentObj._id) {
        idxToDelete = idx;

        $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title-top',
          ariaDescribedBy: 'modal-body-top',
          templateUrl: 'partials/confirm-delete.html',
          size: 'sm',
          scope: $scope,
          resolve: {
            data: {
              item: item,
              currentObj: currentObj,
              idxToDelete: idxToDelete
            }
          },
          controller: 'ItsEasyConfirmDeleteController'
        });
      }
    });
  };

  $scope.select = function(item, idx) {


    if ($('a[href="#job_details"]').parent().hasClass("active")) {
      if (item === "job") {
        return;
      }
      if ($("#dealer").hasClass("active") && item === "crop") {
        return;
      }
    }

    var _currentSelected, _selectedItems, _selectedItemsLength, _alreadySelected;

    _currentSelected = $scope.tables[item + "s"].current_page_data[idx];
    _alreadySelected = _currentSelected.selected;

    // If already selected
    if (_alreadySelected) {
      $scope.tables[item + "s"].current_page_data[idx].selected = false;

      // Check if there is more selected items - if so mark that one as selected otherwise clear current_item
      _selectedItems = $scope.getSelectedData(item);
      _selectedItemsLength = _selectedItems ? _selectedItems.length : 0;

      if (_selectedItemsLength) {
        $scope["current_" + item] = _selectedItems[_selectedItemsLength - 1];
      } else if (!_selectedItemsLength) {
        $scope["current_" + item] = undefined;
      }

      // If first time selected
    } else {
      if (item === "dealer" || item === "corp") {
        $scope["current_" + item] = undefined;
        $scope.tables[item + "s"].current_page_data.forEach(function(item) {
          item.selected = false;
        });
      }
      $scope["current_" + item] = $scope.tables[item + "s"].current_page_data[idx];
      $scope.tables[item + "s"].current_page_data[idx].selected = true;
    }

    $scope.selected_jobs = $scope.selected_jobs.concat($scope.tables.jobs.current_page_data.filter(function(item) {
      return (item.selected);
    }));
  };

  $scope.editClicked = function(item, event) {

    if (event) {
      event.preventDefault();
    }

    angular.element("a[href='#information']").trigger('click');

    if (angular.isUndefined($scope['current_' + item])) {
      return toastr.error('Please select ' + item + ' or click add');
    }

    $('a[href="#' + item + '_details"]').tab('show');

    if (item === "job") {
      var job = $scope.current_job;
      if ("Geico All State Esurance State Farm Progressive".indexOf(job.vehicle_insurance_company) === -1) {
        $(".insurance-company > option:nth-child(1)").after("<option selected=true>" + job.vehicle_insurance_company + "</option>");
      }
    }

  };

  $scope.addClicked = function(item) {

    $scope['current_' + item] = { created_by: $scope.active_user.name };
    $scope.current_dealer = {};
    $scope.current_corp = {};
    angular.element("a[href='#information']").trigger('click');

    if (item === "job") {
      $scope.current_job.trans_type = "INITIAL";
      $scope.current_job.lease_or_buy = "lease";
      $scope.current_job.initial = true;
      $scope.current_job.date = (new Date());
      $scope.current_job.initial = $scope.current_job.trans = $scope.current_job.renew = $scope.current_job.rep_pl = $scope.current_job.dupl = $scope.current_job.comm = $scope.current_job.rental = $scope.current_job.hold = false;
    }

    $('a[href="#' + item + '_details"]').tab('show');
  };

  $scope.deleteClicked = function(item) {
    $scope.remove(item);
  };

  $scope.formSubmitted = function(item) {

    if (item === "job") {

      ["date_sent", "date", "primary_dob", "coowner_dob", "vehicle_lease_cancel_date", "vehicle_lease_sign_date", "vehicle_purchase_date"].forEach(function(dateType) {
        var dateVal = angular.element("[ng-model='current_job." + dateType + "']").val();
        if (dateVal && dateVal.length > 0) {
          $scope.current_job[dateType] = dateVal;
        }
      });

      if ($scope.current_job.vehicle_insurance_company_text && $scope.current_job.vehicle_insurance_company_text.length) {
        $scope.current_job.vehicle_insurance_company = $scope.current_job.vehicle_insurance_company_text;
      }

    }

    if ($scope['current_' + item]._id) {
      $scope.save(item);
    } else {
      $scope.create(item);
    }
  };

  $scope.tables = {};

  $scope.user = {
    name: '',
    password: ''
  };

  $scope.getCurrentPageData = function(type) {

    var currIdx = $scope.tables[type].current_page - 1,
      itemsPerPage = Number($scope.tables[type].items_per_page);

    return $scope[type].slice(itemsPerPage * currIdx, (itemsPerPage * currIdx) + itemsPerPage);
  };

  $scope.dataExists = function(type, direction) {
    if (direction === 'next') {
      return $scope.tables[type].current_page * $scope.tables[type].items_per_page < $scope.tables[type].total_items;
    }
    if (direction === 'prev') {
      return $scope.tables[type].current_page > 1;
    }
  };

  ['dealer', 'corp', 'job'].forEach(function(item) {

    var obj = {};
    obj.current_page = 1;
    obj.items_per_page = 5;
    $scope.tables[item + 's'] = obj;
    $scope["curr_" + item] = undefined;
    $scope["curr_" + item + "_idx"] = undefined;
  });

  $scope.pageChanged = function(type, dir) {
    // Switch to next page only if there is items to show
    if (dir === 'next' && $scope.dataExists(type, 'next')) {
      $scope.tables[type].current_page++;
      $scope.tables[type].current_page_data = $scope.getCurrentPageData(type);
    }

    if (dir === 'prev' && $scope.dataExists(type, 'prev')) {
      $scope.tables[type].current_page--;
      $scope.tables[type].current_page_data = $scope.getCurrentPageData(type);
    } else {
      $scope.tables[type].current_page_data = $scope.getCurrentPageData(type);
    }

    $scope.tables[type].has_prev_data = $scope.dataExists(type, 'prev');
    $scope.tables[type].has_next_data = $scope.dataExists(type, 'next');
  };

  $scope.selectAll = function(items) {

    for (var i = 0; i < $scope.tables[items].current_page_data.length; i++) {

      if ($scope.all_selected[items]) {
        $scope.tables[items].current_page_data[i].selected = true;
      } else {
        $scope.tables[items].current_page_data[i].selected = false;
      }
    }
  };

  $timeout(function() {
    $rootScope.loading = false;
    angular.element(".get_user_modal").modal();
  }, 500);

  $scope.userSelected = function() {
    if ($scope.active_user.name.length) {
      angular.element(".get_user_modal").modal("hide");
    }
  };

  $scope.createForms = function() {
    ItsEasyApiService.getForms($scope.current_job._id, function(successResp) {
      angular.element(".pdf").removeClass("disabled");
    }, function(errorResp) {});
  };

  $scope.updateForJob = function(item) {

    $(".pdf").addClass("disabled");

    if (item === "dealer") {

      $scope.current_dealer = $scope.dealers.filter(function(dealer) {
        return ($scope.current_job[item + "_id"] === dealer._id);
      })[0] || {};

    } else {

      $scope.current_corp = $scope.corps.filter(function(corp) {
        return ($scope.current_job[item + "_id"] === corp._id);
      })[0] || {};

    }

    $scope.clearFilter();
  };

  $scope.updateIdsOnCurrentJob = function(id) {

    switch (angular.element("#job_details li.active a").text().toLowerCase()) {

      case "dealer":
        $scope.current_job.dealer_id = id;
        break;

      case "lessor":
        $scope.current_job.lessor_id = id;
        break;

      case "liens":
        $scope.current_job.lien_id = id;
        break;
    }
  };

  $scope.getSelectedData = function(item) {
    var _selectedItems = [];

    var i = 0;
    for (; i < $scope.tables[item + "s"].current_page_data.length; i++) {
      if ($scope.tables[item + "s"].current_page_data[i].selected) {
        _selectedItems.push($scope.tables[item + "s"].current_page_data[i]);
      }
    }

    return _selectedItems;
  };

  $scope.printSheet = function() {
    $scope.selected_sheet.state = "";
    angular.element(".print_sheet_modal").modal();
  };

  $scope.sheetSelected = function() {

    $scope.selected_sheet.state = "PROCESSING";
    angular.element(".printable-sheets").addClass("hide");

    var jobIds = "";
    $scope.selected_jobs.forEach(function(job) {
      jobIds += (job._id + "__");
    });

    if (jobIds.length > 0) {

      jobIds = jobIds.slice(0, -2);

      ItsEasyApiService.getSheet({ job_ids: jobIds, sheet_name: $scope.selected_sheet.name }, function(successResp) {

        $scope.selected_sheet.state = "READY";
        $scope.created_sheet = successResp.data.data;

      }, function(errorResp) {
        $scope.selected_sheet.state = "";
        $(".modal").modal("hide");
      });
    }
  };

  $scope.$on('activeViewChanged', function(e) {
    $scope.clearFilter();
    $scope.showEntriesCount = $scope.tables[$scope.activeView].current_page_data.length <= $scope.tables[$scope.activeView].total_items;
  });

  $scope.filterTable = function(item) {

    var searchField,
      searchFieldKeys = {
        corps: ["name", "corp_code", "city", "state", "zip", "fed_tax_id"],
        dealers: ["name", "city", "state", "zip"],
        jobs: ["vehicle_vin", "primary_last_name", "vehicle_insurance_company", "dealer_name"]
      };

    searchField = searchFieldKeys[item].filter(function(type) {
      return ($scope.search[type] && $scope.search[type].length);
    })[0];

    if (searchField && searchField.length) {
      $scope[item] = $scope["all_" + item].filter(function(obj) {
        var shouldReturnObj = false;
        var searchFieldValue = $scope.search[searchField];


        if (item === "jobs" && searchField === "dealer_name") {
          var dealerId = obj.dealer_id;
          if (obj.dealer_id == dealerId) {
            var dealer = $scope.all_dealers.filter(function(dealer) {
              return (("" + dealerId) === ("" + dealer._id));
            })[0];
            if (dealer && dealer.name.toLowerCase().indexOf(searchFieldValue.toLowerCase()) === 0) {
              shouldReturnObj = true;
            }
          }
        } else if (obj[searchField] && (obj[searchField].toLowerCase().indexOf(searchFieldValue.toLowerCase()) === 0)) {
          shouldReturnObj = true;
        }
        return shouldReturnObj;
      });

      $scope.updateTables(item);
      $scope.showEntriesCount = $scope.tables[$scope.activeView].current_page_data.length <= $scope.tables[$scope.activeView].total_items;
    }
  };

  $scope.clearFilter = function() {

    ["dealers", "jobs", "corps"].forEach(function(item) {
      $scope[item] = $scope["all_" + item];
      $scope.updateTables(item);
      $scope.search = {};
    });

    $scope.showEntriesCount = $scope.tables[$scope.activeView].current_page_data.length <= $scope.tables[$scope.activeView].total_items;
  };

  $scope.sellerSameAsDealerChoice = function() {

    $scope.updateForJob("dealer");

    if ($scope.current_job.seller_dealer_same) {
      ["name", "address1", "address2", "city", "state", "zip", "state", "zip", "corp_code"].forEach(function(item) {
        $scope.current_job["seller_" + item] = $scope.current_dealer[item];
      });
    }
  };

  $scope.companyOrIndividualChosen = function() {
    $scope.current_job.primary_first_name = $scope.current_job.primary_middle_name = $scope.current_job.primary_last_name = $scope.current_job.primary_company = "";
  };

  $scope.updateJobStatus = function(job) {

    ItsEasyApiService.update(job._id, "job", { status: job.status }, function(successResp) {

      $scope.isBusy = false;
      toastr.success('Status Updated.');

    }, function(errorResp) {

      $scope.isBusy = false;
      toastr.error('Error while updating Status.');
    });
  };

  $scope.saveSheet = function(fileName) {

    $scope.isBusy = true;

    ItsEasyApiService.create("sheet", { created_sheet_file_name: fileName, created_sheet_name: $scope.created_sheet_name.txt }, function(successResp) {

      $scope.isBusy = false;
      toastr.success('Sheet Saved.');

    }, function(errorResp) {

      $scope.isBusy = false;
      toastr.error('Error saving sheet.');
    });
  };


}]);