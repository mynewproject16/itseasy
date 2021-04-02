angular.module('itsEasyApp').controller('ItsEasyController', ['$scope', '$rootScope', '$http', 'ItsEasyApiService', 'UtilityService', 'toastr', '$uibModal', '$timeout', '$interval', function($scope, $rootScope, $http, ItsEasyApiService, UtilityService, toastr, $uibModal, $timeout, $interval) {


  



  $scope.isPreviousPage = false;
  $scope.isSearch = false;
  $scope.isBusy = false;
  $scope.flag =false;
  $scope.flagPrev =true;
  $scope.showPrev =false;
  $scope.dealers = [];
  $scope.corps = [];
  $scope.jobs = [];
  $scope.users = [];

  $scope.all_dealers = [];
  $scope.all_corps = [];
  $scope.all_jobs = [];
  $scope.all_users = [];

  $scope.newcontact = {};
  $scope.logincontact = {};
  $scope.search = {};
  $scope.SearchData = {};
  
  $scope.selected_jobs = [];
  $scope.current_dealer = undefined;
  $scope.current_corp = undefined;
  $scope.current_job = undefined;
  $scope.current_user = undefined;
  $scope.hideDelete = false;
  $scope.jobRec = false;
  $scope.showArchive = false;
  $scope.showEntriesCount = false;
  

  $scope.all_selected = {};
  $scope.active_user = { name: "" };
  $scope.selected_sheet = { name: "" };
  $scope.created_sheet = undefined;
  $scope.created_sheet_name = { txt: "" };
  $scope.printableSheets = undefined;
  $scope.registerVisibility = false;
  $scope.showUpdate = false;
  $scope.active_user.name = localStorage.getItem('activeUserName');

  $scope.currentPage = 1;
  $scope.numberOfPages = 0;
  $scope.getsearchdealRecord=[];

  var remember = sessionStorage.checkbox;

if ( remember == 'true' ) {
  $scope.logincontact.name =  sessionStorage.username;
  $scope.logincontact.password =  sessionStorage.userPass;
  $scope.logincontact.rem_check =  sessionStorage.checkbox;
}

// document.getElementById("name").value= sessionStorage.username;

  $scope.ChangePageSize= [       
    { id: 0, name: "5"},
      { id: 1, name: "10" },
     { id: 2, name: "15" },
     { id: 3, name: "20"  }
  ];
  $scope.pageSizeSelected = $scope.ChangePageSize[0];
  // $scope.pageSizeCount={};
  $scope.onPageSizeChange = function (test, select) {
    // debugger
   console.log(test.name);
   console.log($scope.pageData.page)
  $scope.pageData.limit = test.name;
   $scope.showMECount = test.name;
  $scope.PageChangeData.totalDataPerPage=test.name;
  if($scope.activeView === 'jobs'){
    if(select == 'job'){
      $scope.pageData.page =1;
      $scope.pageChanged('job','next');
   $scope.getAll();
    }else if(select == 'arch'){
  
      $scope.pageData.page =1;
      $scope.pageChanged('archive','next');
      $scope.getAllArchive();
    }else if(select == 'dealers'){
      $scope.getAllDealers();
    }else if(select == 'corps'){
      $scope.getAllCorps();
    }
  
  }
 if($scope.activeView ==="dealers"){
  $scope.pageData.page =1;
  $scope.pageChanged('dealer','next');
  $scope.getAllDealers();
 }
   if($scope.activeView ==="corps"){
    $scope.pageData.page =1;
    $scope.pageChanged('corp','next');
    $scope.getAllCorps();
 }
 if($scope.activeView ==="users"){
  $scope.pageData.page =1;
  $scope.pageChanged('user','next');
  $scope.getAllUsers();
}
};
//true orFalse
console.log('test'+$scope.flagPrev);

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
    
    date_return: { opened: false },
    primary_dob: { opened: false },

    coowner_dob: { opened: false },

    vehicle_lease_cancel_date: { opened: false },
    vehicle_lease_sign_date: { opened: false },
    vehicle_purchase_date: { opened: false }
  };
  $scope.openDatePicker = function(item) {
    $scope.jobDatePickers[item].opened = true;
  };


  $scope.getAllDealers = function() {
    //
    // $scope.pageData = {
    //   page : "1",
    //   limit : "10"
    // }
   

    ItsEasyApiService.getAllDealers($scope.pageData,function(successResp) {
    //
        var item = "dealers";
        $scope.getDealersCount = successResp.data.lengthCount;
        $scope.getdealersRecord = successResp.data.totalPages;

      
        $scope[item] = successResp.data && successResp.data[item];
        $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));

       $scope.updateTables(item);
    });
  
  }

  $scope.getAllCorpsRec = function() {
   
    ItsEasyApiService.getAllCorpsRec(function(successResp) {
    
        var item = "corps";
        $scope[item] = successResp.data && successResp.data[item];
        $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
        $scope.updateTables(item);
    });
  
  }

  $scope.getAllCorps = function() {
    // $scope.pageData = {
    //   page : "1",
    //   limit : "10"
    // }
    
    ItsEasyApiService.getAllCorps($scope.pageData,function(successResp) {
    
        var item = "corps";
        $scope.getCorpsCount = successResp.data.lengthCount;
        $scope.getcorpsRecord = successResp.data.totalPages;

        $scope[item] = successResp.data && successResp.data[item];
        $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));

       $scope.updateTables(item);
       ItsEasyApiService.getAllCorpsRec(function(successResp) {
    
        var item = "corps";
        $scope[item] = successResp.data && successResp.data[item];
        $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
    });
    });
  
  }


  $scope.getAllUsers = function() {
    // $scope.pageData = {
    //   page : "1",
    //   limit : "10"
    // }
    
    ItsEasyApiService.getAllUsers($scope.pageData,function(successResp) {
    
        var item = "users";
        $scope.getusersCount = successResp.data.lengthCount;
        $scope.getusersRecord = successResp.data.totalPages;
        $scope[item] = successResp.data && successResp.data[item];
        $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));

       $scope.updateTables(item);
    });
  
  }
  $scope.pageData = {
    page : "1",
    limit : "5"
  }
$scope.PageChangeData ={
  index:$scope.pageData.page,
  totalDataPerPage:$scope.pageData.limit
}

$scope.getAllArchive = function(rec) {
  //
  if(rec=='dashboard'){
    $scope.pageData.page = 1;
    $scope.PageChangeData.totalDataPerPage =5;
    $scope.filterpageData.filterPage =1;
    $scope.filterpageData.filterLimit =5;
    $scope.pageSizeSelected.name = 5;
    $scope.showMECount= 5;
  }
 
  $scope.showArchive = true;
  $scope.hideDelete = true;
  $scope.jobRec = true;
  
  ItsEasyApiService.getAllDealersRec(function(successResp) {
    var item = "dealers";
    $scope[item] = successResp.data && successResp.data[item];
    $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
  ItsEasyApiService.getAllArchive($scope.pageData,function(successResp) {
  
var item = "jobs";
    successResp.data.jobs.forEach(function(job) {
      
      $scope.jobsDataCount = successResp.data.lengthCount;
      $scope.archDataCount = successResp.data.lengthCount;
      $scope.getarchivesRecord = successResp.data.totalPages;

        if (job.dealer_id && job.dealer_id.length) {
          job.dealer = $scope.all_dealers.filter(function(dealer) {
            return (job.dealer_id === dealer._id);
          })[0];
        }

        job.last_name_table = (job.primary_last_name && job.primary_last_name.length) ? job.primary_last_name : job.primary_company;
      });
      $scope[item] = successResp.data && successResp.data[item];
      $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));

     $scope.updateTables(item);
  });
});
}

  $scope.getAll = function(rec) {
  
    if(rec=='dashboard'){
      $scope.pageData.page = 1;
      $scope.PageChangeData.totalDataPerPage =5;
      $scope.filterpageData.filterPage =1;
      $scope.filterpageData.filterLimit =5;
      $scope.pageSizeSelected.name = 5;
      $scope.showMECount= 5;
    } 
   
    $scope.showArchive= false;
    $scope.hideDelete= false;
    $scope.jobRec= false;
    // $scope.getAllCorpsRec();
    ItsEasyApiService.getAllDealersRec(function(successResp) {
      var item = "dealers";
      $scope[item] = successResp.data && successResp.data[item];
      $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
      ItsEasyApiService.getAllJobs($scope.pageData,function(successResp) {
    
        var item = "jobs";
              successResp.data.jobs.forEach(function(job) {
                $scope.jobsDataCount = successResp.data.lengthCount;
                $scope.getjobsRecord = successResp.data.totalPages;
        
                  if (job.dealer_id && job.dealer_id.length) {
                    job.dealer = $scope.all_dealers.filter(function(dealer) {
                      return (job.dealer_id === dealer._id);
                    })[0];
                  }
        
                  job.last_name_table = (job.primary_last_name && job.primary_last_name.length) ? job.primary_last_name : job.primary_company;
                });
                $scope[item] = successResp.data && successResp.data[item];
                $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
        
               $scope.updateTables(item);
               
            });
            
  });
  $scope.getAllCorps();
    // $scope.getAllDealers();
    if($scope.activeView === 'dealers'){
      //
    //  $scope.getAllUsers();
    $scope.getAllDealers();
   //$scope.getAllCorps();
    }
    if($scope.activeView === 'corps'){
      $scope.getAllCorps();
    }
     if($scope.activeView === 'users'){
      $scope.getAllUsers();
    }
  }

  //   ItsEasyApiService.getAll(function(successResp) {

  //     ['dealers', 'corps', 'jobs', 'sheets', 'users'].forEach(function(item) {

  //       if (item === "sheets") {

  //         if (item === "sheets" && successResp && successResp.data.sheets) {

  //           $scope.printableSheets = successResp.data.sheets.filter(function(sheet) {
  //             var createdOn = new Date(sheet.created_at),
  //               today = new Date();
  //             return (createdOn.getDate() == today.getDate() &&
  //               createdOn.getMonth() == today.getMonth() &&
  //               createdOn.getFullYear() == today.getFullYear());
  //           });
  //         }

  //         return;
  //       }

  //       if (item === "jobs" && successResp && successResp.data.jobs) {

  //         successResp.data.jobs.forEach(function(job) {

  //           if (job.dealer_id && job.dealer_id.length) {
  //             job.dealer = $scope.all_dealers.filter(function(dealer) {
  //               return (job.dealer_id === dealer._id);
  //             })[0];
  //           }

  //           job.last_name_table = (job.primary_last_name && job.primary_last_name.length) ? job.primary_last_name : job.primary_company;
  //         });
  //       }

  //       // if (item === "users" && successResp && successResp.data.users) {

  //       //   successResp.data.users.forEach(function(user) {

  //       //   });
  //       // }
  //       $scope[item] = successResp.data && successResp.data[item];
  //       $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));

  //       $scope.updateTables(item);
  //     });

  //     $scope.showEntriesCount = $scope.tables[$scope.activeView].current_page_data.length <= $scope.tables[$scope.activeView].total_items;

  //   }, function(errorResp) {});
  // }
  $scope.getAll();




  $scope.updateTables = function(item) {
//
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

  $scope.save = function(item, activate) {

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
        if(activate == "fromLessor"){
          $scope.current_corp={};
        }else if(activate == "fromLein"){
          $scope.current_corp={};
        }
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
     $scope['current_' + item]={};
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

// $scope.isPreviousPage= true;
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
      if(item == "user"){
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

  $scope.editClicked = function(item,name, event) {

    if(name == "arch"){
      if (event) {
        event.preventDefault();
      }
      if (angular.isUndefined($scope['current_' + item])) {
        return toastr.error('Please select ' + item + ' or click add');
      }
      else if ($scope["current_" + item]._id != ""){
        ItsEasyApiService.read($scope["current_" + item]._id, item,function(successResp) {
          if(successResp.data.deleted == false){
            return toastr.error('Please select ' + item + ' or click add');
          }else{
           
  
            $('a[href="#' + item + '_details"]').tab('show');
          }
                });
      }else{  
  
      $('a[href="#' + item + '_details"]').tab('show');
  
  
      }
    }
else if(name="nom"){
  if (event) {
    event.preventDefault();
  }
  if (angular.isUndefined($scope['current_' + item])) {
    return toastr.error('Please select ' + item + ' or click add');
  }
  else if ($scope["current_" + item]._id != ""){
    ItsEasyApiService.read($scope["current_" + item]._id, item,function(successResp) {
      if(successResp.data.deleted == true){
        return toastr.error('Please select ' + item + ' or click add');
      }else{
        // angular.element("a[href='#information']").trigger('click');

        $('a[href="#' + item + '_details"]').tab('show');
      }
            });
  }else{  
    // angular.element("a[href='#information']").trigger('click');

  $('a[href="#' + item + '_details"]').tab('show');


  }
}
   
     
   
    if (item === "job") {
      var job = $scope.current_job;
      if ("Geico All State Esurance State Farm Progressive".indexOf(job.vehicle_insurance_company) === -1) {
        $(".insurance-company > option:nth-child(1)").after("<option selected=true>" + job.vehicle_insurance_company + "</option>");
      }
    }

  };

  $scope.editUser = function(item, event) {

    if (event) {
      event.preventDefault();
    }
    if (angular.isUndefined($scope['current_' + item])) {
      return toastr.error('Please select a ' + item + ' or click on  add');
    }
    else if ($scope["current_" + item]._id != ""){
      ItsEasyApiService.read($scope["current_" + item]._id, item,function(successResp) {
        if(successResp.data.deleted == true){
          return toastr.error('Please select a ' + item + ' or click on add');
        }else{
          // angular.element("a[href='#manage_users']").trigger('click');

          $scope.showUpdate = true;
    $('a[href="#register"]').tab('show');
        }
              });
    }else{  
      // angular.element("a[href='#manage_users']").trigger('click');

    $scope.showUpdate = true;
    $('a[href="#register"]').tab('show');


    }
    // angular.element("a[href='#manage_users']").trigger('click');

    // if (angular.isUndefined($scope['current_' + item]) || angular.equals($scope['current_' + item], {}) ) {
    //   return toastr.error('Please select a ' + item + ' or click on add user');
    // }
    // $scope.showUpdate = true;
    // $('a[href="#register"]').tab('show');


  };
  

  $scope.registerClicked = function(item, event) {
    
    $scope.current_user = {};
  
      $scope.showUpdate = false;
    
    
    // angular.element("a[href='#manage_users']").trigger('click');
    
    $('a[href="#register"]').tab('show');

  };



  
  $scope.callLogin = function(item, event) {
   // $scope.registerVisibility = false;
    angular.element("a[href='#manage_users']").trigger('click');

  };
  
  $scope.addClicked = function(item) {

    $scope['current_' + item] = { created_by: $scope.active_user.name };
    $scope.current_dealer = {};
    $scope.current_corp = {};
    $scope.current_user = {};
    // angular.element("a[href='#information']").trigger('click');

    if (item === "job") {
      //;
      $scope.current_job.trans_type = "INITIAL";
      $scope.current_job.lease_or_buy = "lease";
      $scope.current_job.initial = true;
      $scope.current_job.date = (new Date());
      // $scope.current_job.initial =
      $scope.current_job.trans = $scope.current_job.renew = $scope.current_job.rep_pl = $scope.current_job.dupl = $scope.current_job.comm = $scope.current_job.rental = $scope.current_job.hold = false;
      angular.element("a[href='#information']").tab('show');
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

    // var currIdx = $scope.tables[type].current_page - 1,
    //   itemsPerPage = Number($scope.tables[type].items_per_page);
    var currIdx =$scope.PageChangeData.index;
    itemsPerPage = $scope.PageChangeData.totalDataPerPage;
    //   currIdx=1;
    //   itemsPerPage=5;
    // }
// var x =$scope[type].slice(itemsPerPage * currIdx, (itemsPerPage * currIdx) + itemsPerPage);
var x =$scope[type].slice(currIdx-1,itemsPerPage);
    return x;
  };

  $scope.dataExists = function(type, direction) {
    if (direction === 'next') {
      return $scope.tables[type].current_page * $scope.tables[type].items_per_page < $scope.tables[type].total_items;
    }
    if (direction === 'prev') {
      return $scope.tables[type].current_page > 1;
    }
  };

  ['dealer', 'corp', 'job', 'user'].forEach(function(item) {
//
    var obj = {};
    obj.current_page = 1;
    obj.items_per_page = 5;
    $scope.tables[item + 's'] = obj;
    $scope["curr_" + item] = undefined;
    $scope["curr_" + item + "_idx"] = undefined;
  });

  // $scope.pageChanged = function(type, dir) {
    
  //   if(dir==='next' && type==='jobs' && $scope.pageData.page < $scope.jobsDataCount){
     
  //     document.getElementById("nextBtn").disabled = false;
  //     document.getElementById("prevBtn").classList.remove("disabled");
  //     $scope.falgPrev = false;
  //     $scope.pageData.page++;
  //     $scope.getAll();
  //     if($scope.pageData.page > $scope.jobsDataCount){
  //       document.getElementById("nextBtn").disabled = true;
  //     }
  //   }
   
  //   if(dir==='prev' && type==='jobs' && $scope.pageData.page>1){
  //     //
  //     $scope.falgPrev = false;
  //     $scope.pageData.page--;
  //     $scope.getAll();
  //   }
  //   if(dir==='prev' && type==='jobs' && $scope.pageData.page==1){
  //     document.getElementById("prevBtn").classList.add("disabled");
  //   }
  //   if(dir==='next' && type==='dealers' && $scope.pageData.page < $scope.getDealersCount){
  //     document.getElementById("nextBtn").disabled = false;
  //     document.getElementById("prevBtn").classList.remove("disabled");
  //     $scope.flag = false;
  //     $scope.falgPrev = true;
  //     $scope.pageData.page++;
  //     $scope.getAllDealers();
  //     if($scope.pageData.page >$scope.getDealersCount){
  //       document.getElementById("nextBtn").disabled = true;
  //     }
  //   }
    
  //   if(dir==='prev' && type==='dealers' && $scope.pageData.page>1){
  //     $scope.falgPrev = false;
  //     $scope.pageData.page--;
  //     $scope.getAllDealers();
  //   }
  //   if(dir==='prev' && type==='dealers' && $scope.pageData.page==1){
  //     document.getElementById("prevBtn").classList.add("disabled");
  //   }

  //   if(dir==='next' && type==='archive' && $scope.pageData.page < $scope.archDataCount){
  //     document.getElementById("nextBtn").disabled = false;
  //     document.getElementById("prevBtn").classList.remove("disabled");
  //     $scope.flag = false;
  //     $scope.falgPrev = true;
  //     $scope.pageData.page++;
  //     $scope.getAllArchive();
  //     if($scope.pageData.page >$scope.archDataCount){
  //       document.getElementById("nextBtn").disabled = true;
  //     }
  //   }
    
  //   if(dir==='prev' && type==='archive' && $scope.pageData.page>1){
  //     $scope.falgPrev = false;
  //     $scope.pageData.page--;
  //     $scope.getAllArchive();
  //   }
  //   if(dir==='prev' && type==='archive' && $scope.pageData.page==1){
  //     document.getElementById("prevBtn").classList.add("disabled");
  //   }

  //   if(dir==='next' && type==='corps' && $scope.pageData.page < $scope.getCorpsCount){
  //     document.getElementById("nextBtn").disabled = false;
  //     document.getElementById("prevBtn").classList.remove("disabled");
  //     $scope.flag = false;
  //     $scope.falgPrev = true;
  //     $scope.pageData.page++;
  //     $scope.getAllCorps();
  //     if($scope.pageData.page <$scope.getCorpsCount){
  //       document.getElementById("nextBtn").disabled = true;
  //     }
  //   }
    
 
  //   if(dir==='prev' && type==='corps' && $scope.pageData.page>1){
  //     $scope.falgPrev = false;
  //     $scope.pageData.page--;
  //     $scope.getAllCorps();
  //   }
  //   if(dir==='prev' && type==='corps' && $scope.pageData.page==1){
  //     document.getElementById("prevBtn").classList.add("disabled");
  //   }
  //   if(dir==='next' && type==='users' && $scope.pageData.page < $scope.getusersCount){
  //     document.getElementById("nextBtn").disabled = false;
  //     document.getElementById("prevBtn").classList.remove("disabled");
  //     $scope.flag = false;
  //     $scope.falgPrev = true;
  //     $scope.pageData.page++;
  //     $scope.getAllUsers();
  //     if($scope.pageData.page <=$scope.getusersCount){
  //       document.getElementById("nextBtn").disabled = true;
  //     }
  //   }
 
  //   if(dir==='prev' && type==='users' && $scope.pageData.page>1){
  //     $scope.falgPrev = false;
  //     $scope.pageData.page--;
  //     $scope.getAllUsers();
  //   }
  //   if(dir==='prev' && type==='users' && $scope.pageData.page==1){
  //     document.getElementById("prevBtn").classList.add("disabled");
  //   }
  //   if($scope.pageData.page<=$scope.getusersCount){
  //     // document.getElementById("nextBtn").disabled = true;
  //     document.getElementById("nextBtn").classList.add("disabled");
     
  //   }
  // };
  $scope.pageChanged = function(type, dir) {
    
    
    
    if(dir==='next' && type==='jobs' && $scope.pageData.page < $scope.getjobsRecord){
     
      document.getElementById("nextBtn").disabled = false;
      document.getElementById("prevBtn").classList.remove("disabled");
      // $scope.falgPrev = false;
      $scope.pageData.page++;
      if($scope.isSearch){
        $scope.filterpageData.filterPage++;
        if($scope.SearchData.searchKey.name != undefined){
          $scope.nextPage();
        }else{   $scope.filterTable('jobs');}
      
        
      }else{
        $scope.getAll();
      }
   if($scope.pageData.page > $scope.jobsDataCount){
        document.getElementById("nextBtn").disabled = true;
      }
    }
   
    if(dir==='prev' && type==='jobs' && $scope.pageData.page>1){
      //
      $scope.falgPrev = false;
      document.getElementById("nextBtn").classList.remove("disabled");
      $scope.pageData.page--;
      if($scope.isSearch){
        $scope.filterpageData.filterPage--;
        if($scope.SearchData.searchKey.name != undefined){
          $scope.previousPage();
        }else{   $scope.filterTable('jobs');}
     
      }else{
        $scope.getAll();
      }
    }
    if(dir==='prev' && type==='jobs' && $scope.pageData.page==1){
      document.getElementById("prevBtn").classList.add("disabled");
    }
    if( type==='jobs' && $scope.pageData.page>=$scope.getjobsRecord){
      document.getElementById("nextBtn").classList.add("disabled");
    }

    if(dir==='next' && type==='archive' && $scope.pageData.page < $scope.getarchivesRecord){
          document.getElementById("nextBtn").disabled = false;
          document.getElementById("prevBtn").classList.remove("disabled");
          // $scope.flag = false;
          // $scope.falgPrev = true;
          $scope.pageData.page++;
          if($scope.isSearch){
            $scope.filterpageData.filterPage++;
            
        if($scope.SearchData.searchKey.name != undefined){
          $scope.nextPage();
        }else{   $scope.filterTable('archive');}
            
          }else{
            $scope.getAllArchive();
          }
        
          // if($scope.pageData.page >$scope.archDataCount){
          //   document.getElementById("nextBtn").disabled = true;
          // }
        }
        
        if(dir==='prev' && type==='archive' && $scope.pageData.page>1){
          $scope.falgPrev = false;
          document.getElementById("nextBtn").classList.remove("disabled");
          $scope.pageData.page--;
          if($scope.isSearch){
            $scope.filterpageData.filterPage--;
            if($scope.SearchData.searchKey.name != undefined){
              $scope.previousPage();
            }else{   $scope.filterTable('archive');}
                
          }else{
            $scope.getAllArchive();
          }
        }
        if(dir==='prev' && type==='archive' && $scope.pageData.page==1){
          document.getElementById("prevBtn").classList.add("disabled");
        }
        if(type==='archive' && $scope.pageData.page>=$scope.getarchivesRecord){
          document.getElementById("nextBtn").classList.add("disabled");
        }

    if(dir==='next' && type==='dealers' && $scope.pageData.page < $scope.getdealersRecord){
      document.getElementById("nextBtn").disabled = false;
       document.getElementById("prevBtn").classList.remove("disabled");
      //  document.getElementById("prevBtn").disabled = false;

      // $scope.flag = false;
      $scope.showPrev = true;
      $scope.pageData.page++;
      if($scope.isSearch){
        $scope.filterpageData.filterPage++;
        $scope.filterTable('dealers');
      }else{
        $scope.getAllDealers();
      }
     
      // if($scope.pageData.page >$scope.getDealersCount){
      //   document.getElementById("nextBtn").disabled = true;
      // }
    }
    
    if(dir==='prev' && type==='dealers' && $scope.pageData.page>1){
      $scope.falgPrev = false;
      document.getElementById("nextBtn").classList.remove("disabled");
      $scope.pageData.page--;
      if($scope.isSearch){
        $scope.filterpageData.filterPage--;
        $scope.filterTable('dealers');
      }else{
        $scope.getAllDealers();
      }
   
    }
    if(dir==='prev' && type==='dealers' && $scope.pageData.page==1){
      document.getElementById("prevBtn").classList.add("disabled");
      $scope.showPrev = false;
    }
    if(type==='dealers'&& $scope.pageData.page>=$scope.getdealersRecord){
      document.getElementById("nextBtn").classList.add("disabled");
    }

    if(dir==='next' && type==='corps' && $scope.pageData.page < $scope.getcorpsRecord){
      document.getElementById("nextBtn").disabled = false;
      document.getElementById("prevBtn").classList.remove("disabled");
      // $scope.flag = false;
      // $scope.falgPrev = true;
      $scope.showPrev = true;
      $scope.pageData.page++;
      if($scope.isSearch){
        $scope.filterpageData.filterPage++;
        $scope.filterTable('corps');
      }else{
        $scope.getAllCorps();
      }
    
      // if($scope.pageData.page <$scope.getCorpsCount){
      //   document.getElementById("nextBtn").disabled = true;
      // }
    }
    
 
    if(dir==='prev' && type==='corps' && $scope.pageData.page>1){
      $scope.falgPrev = false;
      document.getElementById("nextBtn").classList.remove("disabled");
      $scope.pageData.page--;
      if($scope.isSearch){
        $scope.filterpageData.filterPage--;
        $scope.filterTable('corps');
      }else{
        $scope.getAllCorps();
      }
   
    }
    if(dir==='prev' && type==='corps' && $scope.pageData.page==1){
      document.getElementById("prevBtn").classList.add("disabled");
      $scope.showPrev = false;
    }
    if(type==='corps' && $scope.pageData.page>=$scope.getcorpsRecord){
      document.getElementById("nextBtn").classList.add("disabled");
    }

    if(dir==='next' && type==='users' && $scope.pageData.page < $scope.getusersRecord){
      document.getElementById("nextBtn").disabled = false;
      document.getElementById("prevBtn").classList.remove("disabled");
      $scope.flag = false;
      $scope.falgPrev = true;
      $scope.pageData.page++;
      $scope.getAllUsers();
      if($scope.pageData.page >$scope.getusersRecord){
        document.getElementById("nextBtn").disabled = true;
      }
    }
    if(dir==='next' && type==='user' && $scope.pageData.page == $scope.getusersRecord){
      document.getElementById("nextBtn").classList.remove("disabled");
      document.getElementById("prevBtn").classList.add("disabled");
      // $scope.flag = false;
      // $scope.falgPrev = true;
      // $scope.pageData.page++;
      $scope.getAllUsers();
      
    }
    if(dir==='next' && type==='dealer' && $scope.pageData.page == $scope.getdealerssRecord){
      document.getElementById("nextBtn").classList.remove("disabled");
      document.getElementById("prevBtn").classList.add("disabled");
      $scope.getAllDealers();
      
    }
    if(dir==='next' && type==='job' && $scope.pageData.page == $scope.getjobsRecord){
      document.getElementById("nextBtn").classList.remove("disabled");
      document.getElementById("prevBtn").classList.add("disabled");
      $scope.getAll();
      
    }
    if(dir==='next' && type==='corp' && $scope.pageData.page == $scope.getcorpsRecord){
      document.getElementById("nextBtn").classList.remove("disabled");
      document.getElementById("prevBtn").classList.add("disabled");
      $scope.getAllCorps();
      
    }

 
    if(dir==='prev' && type==='users' && $scope.pageData.page>1){
      $scope.falgPrev = false;
      document.getElementById("nextBtn").classList.remove("disabled");
      $scope.pageData.page--;
      $scope.getAllUsers();
    }
    if(dir==='prev' && type==='users' && $scope.pageData.page==1){
      document.getElementById("prevBtn").classList.add("disabled");
    }
    if(type==='users' && $scope.pageData.page>=$scope.getusersRecord){
      document.getElementById("nextBtn").classList.add("disabled");
    }
  };
  // $scope.pageChanged = function(type, dir) {
  //   debugger
   
  //   if(dir==='next' && type==='jobs' && $scope.pageData.page < $scope.jobsDataCount){
     
  //     document.getElementById("nextBtn").disabled = false;
  //     document.getElementById("prevBtn").classList.remove("disabled");
  //     $scope.falgPrev = false;
  //     $scope.pageData.page++;
  //     $scope.getAll();
  //     if($scope.pageData.page > $scope.jobsDataCount){
  //       document.getElementById("nextBtn").disabled = true;
  //     }
  //   }
   
  //   if(dir==='prev' && type==='jobs' && $scope.pageData.page>1){
  //     //
  //     $scope.falgPrev = false;
  //     $scope.pageData.page--;
  //     $scope.getAll();
  //   }
  //   if(dir==='prev' && type==='jobs' && $scope.pageData.page==1){
  //     document.getElementById("prevBtn").classList.add("disabled");
  //   }
  //   if(dir==='next' && type==='dealers' && $scope.pageData.page < $scope.getDealersCount){
  //     document.getElementById("nextBtn").disabled = false;
  //     document.getElementById("prevBtn").classList.remove("disabled");
  //     $scope.flag = false;
  //     $scope.falgPrev = true;
  //     $scope.pageData.page++;
  //     $scope.getAllDealers();
  //     if($scope.pageData.page >$scope.getDealersCount){
  //       document.getElementById("nextBtn").disabled = true;
  //     }
  //   }
    
  //   if(dir==='prev' && type==='dealers' && $scope.pageData.page>1){
  //     $scope.falgPrev = false;
  //     $scope.pageData.page--;
  //     $scope.getAllDealers();
  //   }
  //   if(dir==='prev' && type==='dealers' && $scope.pageData.page==1){
  //     document.getElementById("prevBtn").classList.add("disabled");
  //   }
  //   if(dir==='next' && type==='corps' && $scope.pageData.page < $scope.getCorpsCount){
  //     document.getElementById("nextBtn").disabled = false;
  //     document.getElementById("prevBtn").classList.remove("disabled");
  //     $scope.flag = false;
  //     $scope.falgPrev = true;
  //     $scope.pageData.page++;
  //     $scope.getAllCorps();
  //     if($scope.pageData.page <$scope.getCorpsCount){
  //       document.getElementById("nextBtn").disabled = true;
  //     }
  //   }
    

  //   if(dir==='prev' && type==='corps' && $scope.pageData.page>1){
  //     $scope.falgPrev = false;
  //     $scope.pageData.page--;
  //     $scope.getAllCorps();
  //   }
  //   if(dir==='prev' && type==='corps' && $scope.pageData.page==1){
  //     document.getElementById("prevBtn").classList.add("disabled");
  //   }
  //   if(dir==='next' && type==='users' && $scope.pageData.page < $scope.getusersCount){
  //     $scope.flag = false;
  //     $scope.falgPrev = true;
  //     $scope.pageData.page++;
  //     $scope.getAllUsers();
  //     if($scope.pageData.page <$scope.getusersCount){
  //       document.getElementById("nextBtn").disabled = true;
  //     }
  //   }

  //   if(dir==='prev' && type==='users' && $scope.pageData.page>1){
  //     $scope.falgPrev = false;
  //     $scope.pageData.page--;
  //     $scope.getAllUsers();
  //   }
  //   if(dir==='prev' && type==='users' && $scope.pageData.page==1){
  //     document.getElementById("prevBtn").classList.add("disabled");
  //   }
  //   // Switch to next page only if there is items to show
  //   // if (dir === 'next' && $scope.dataExists(type, 'next')) {
  //   //   $scope.tables[type].current_page++;
  //   //   $scope.tables[type].current_page_data = $scope.getCurrentPageData(type);
  //   // }

  //   // if (dir === 'prev' && $scope.dataExists(type, 'prev')) {
  //   //   $scope.tables[type].current_page--;
  //   //   $scope.tables[type].current_page_data = $scope.getCurrentPageData(type);
  //   // } else {
  //   //   $scope.tables[type].current_page_data = $scope.getCurrentPageData(type);
  //   // }

  //   // $scope.tables[type].has_prev_data = $scope.dataExists(type, 'prev');
  //   // $scope.tables[type].has_next_data = $scope.dataExists(type, 'next');
  // };

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

  // $scope.userSelected = function() {
  //   if ($scope.active_user.name.length) {
  //     angular.element(".get_user_modal").modal("hide");
  //   }
  // };

  $scope.createForms = function() {
    if (angular.isUndefined($scope.current_job._id)) {
      return toastr.error('Please create a job');
    }else{
    ItsEasyApiService.getForms($scope.current_job._id, function(successResp) {
      angular.element(".pdf").removeClass("disabled");
    }, function(errorResp) {});
  }
  };
  $scope.saveContact = function(item) {
    if(item=="jobs"){
      toastr.error('Error while creating ' + item);
    
    }
  };

  $scope.updateForJob = function(item) {

    $(".pdf").addClass("disabled");

    if (item === "dealer") {

      $scope.current_dealer = $scope.dealers.filter(function(dealer) {
        return ($scope.current_job[item + "_id"] === dealer._id);
      })[0] || {};

    } else {
if(item == "lessor"){
  $scope.lessorcorp = true;
  $scope.liens = false;
}else{
  $scope.lessorcorp = false;
  $scope.liens = true;
}
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

  
   $scope.$on('rememberMe', function(e) {
    console.log("tested")
    // $scope.logincontact=JSON.parse( sessionStorage.user );
  
    if (sessionStorage.checkbox && sessionStorage.checkbox !== "") {
      //  rmCheck.setAttribute("checked", "checked");
       $scope.logincontact.name =  sessionStorage.username
       $scope.logincontact.password =  sessionStorage.userPass
// debugger;
// ItsEasyApiService.checkUser(sessionStorage.username, function(successResp){
// console.log(successResp.data)
// },function(errorResp){

// });

     } else {
    //   rmCheck.removeAttribute("checked");
       $scope.logincontact.email="";
    }
    
 
   });

  $scope.$on('activeViewChanged', function(e) {
    //;
    $scope.clearFilter();
    $scope.showEntriesCount = $scope.tables[$scope.activeView].current_page_data.length <= $scope.tables[$scope.activeView].total_items;
  });

  $scope.showHeader = function(e) {
    $scope.clearFilter();
    $scope.showEntriesCount = $scope.tables[$scope.activeView].current_page_data.length <= $scope.tables[$scope.activeView].total_items;
  };

    $scope.registerContact = function(item, data) {

      if(data.name == undefined || data.name == ""){
        return toastr.error("Full name can't be blank");
       }
        if(data.email == undefined || data.email == ""){
       return  toastr.error("Email can't be blank");}

       if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
        return toastr.error("Invalid Email")
      } 

       if(data.password == undefined || data.password == ""){
         return toastr.error("Password can't be blank");
       }
      if(data.password.length < 6)
      {
         return toastr.error("Password should be at least 6 characters");
        }
         if(data.phone == undefined || data.phone == ""){
        return  toastr.error("Phone number can't be blank");}

        if (!(/^\d{10,}$/.test(data.phone))) {
          return toastr.error("Phone number should be at least 10 digits.")
        }
 
       if(data.status == undefined || data.status == ""){
         return toastr.error("Status can't be blank");
        }
         if(data.role == undefined || data.role == ""){
        return  toastr.error("Role can't be blank");}
      
        $scope.saveUser(item, data);
      
    };
    $scope.saveUser = function(item, data) {

      $scope['current_' + item] = data;
      if ($scope.isBusy) {
        return;
      }
  
      $scope.isBusy = true;
  
      ItsEasyApiService.registration(item, $scope['current_' + item], function(successResp) {
  
        $scope.isBusy = false;
        if(successResp.data == "Email already used"){

          toastr.error("Email already exist");

        }else{
          $scope[item + 's'].unshift(successResp.data);
          $scope['current_' + item] = $scope[item + 's'][0];
    
          $scope.tables[item + 's'].current_page = 1;
    
          $scope.pageChanged(item + 's');
    
            toastr.success(item + ' created!');
        }
  

      }, function(errorResp) {
        $scope.isBusy = false;
        toastr.error('Error while creating ' + item);
      });
    };

    
    $scope.updateUserContact = function(item,data) {

      if(data.name == undefined || data.name == ""){
       return toastr.error("Fullname can't be blank");
      }
       if(data.email == undefined || data.email == ""){
      return  toastr.error("Email can't be blank");}

      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
        return toastr.success("Invalid Email")
      } 

      if(data.password == undefined || data.password == ""){
        return toastr.error("Password can't be blank");
      }
     if(data.password.length < 6)
     {
        return toastr.error("Password should be at least 6 characters");
       }

        if(data.phone == undefined || data.phone == ""){
       return  toastr.error("Phone number can't be blank.");}

         if (!(/^\d{10,}$/.test(data.phone))) {
          return toastr.error("Phone number should be at least 10 digits.")
        }
        
      if(data.status == undefined || data.status == ""){
        return toastr.error("Status can't be blank");
       }
        if(data.role == undefined || data.role == ""){
       return  toastr.error("Role can't be blank");}

      var currentObj = $scope['current_' + item];
  $scope.registerVisibility= true;
      if ($scope.isBusy) {
        return;
      }
  
      $scope.isBusy = true;
  
      ItsEasyApiService.update(currentObj._id, item, currentObj, function(successResp) {
        $scope.isBusy = false;
        var idxToUpdate;
        $scope[item + 's'].forEach(function(obj, idx) {
          if (obj._id === successResp.data._id) {
            idxToUpdate = idx;
          }
        });
  
        $scope[item + 's'][idxToUpdate] = successResp.data;
        $scope['current_' + item] = $scope[item + 's'][idxToUpdate];
        // document.getElementById("editUser").disabled = true;
        // document.getElementById("deleteUser").disabled = true;
          toastr.success(item + ' updated!');
      
      }, function(errorResp) {
        $scope.isBusy = false;
        toastr.error('Error while updating ' + item);
      });
    };


    // $scope.saveUser = function(item,data) {

    //   if ($scope.isBusy) {
    //     return;
    //   }
    //   $scope.isBusy = true;
    //   ItsEasyApiService.registration(item, data, function(successResp) {
    //     $scope.isBusy = false;
    //     $scope[item + 's'].unshift(successResp.data);
    //     $scope['current_' + item] = $scope[item + 's'][0];
  
    //     $scope.tables[item + 's'].current_page = 1;
  
    //     $scope.pageChanged(item + 's');
    //     toastr.success(item + ' created!');
    //   }, function(errorResp) {
    //     $scope.isBusy = false;
    //     toastr.error('Error while creating ' + item);
    //   });
    // };
    
// window.addEventListener(keyPress, function(e){
//   if(e.keyPress == 13){
//     $scope.submit()
//   }
// })


    $scope.submit = function(data) {
      var remember = document.getElementById('rem_check').checked;
      if(data.name == undefined || data.name == ""){
       return toastr.error(" Email can't be blank");
      } 
       if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.name))) {
        return toastr.error("Invalid Email")
      
      } 
      if(data.password == undefined || data.password == ""){
      return  toastr.error(" Password can't be blank");}

     if(data.password.length < 6)
     {
        return toastr.error("Password should be at least 6 characters");
       }
      
     if (remember && data.name !== "") {
          sessionStorage.username = data.name;
          sessionStorage.userPass = data.password;
          sessionStorage.checkbox = remember;
        } else {
          sessionStorage.username = "";
          sessionStorage.userPass ="";
          sessionStorage.checkbox = "";
        }
      // if ($('#rem_check').attr('checked')) {
      //   var username = $('#name').attr( sessionStorage.username );
      //   var password = $('#password').attr(data.userPass.$viewValue);
      //   // set cookies to expire in 14 days
      //   $.cookie('username', username, { expires: 14 });
      //   $.cookie('password', password, { expires: 14 });
      //   $.cookie('remember', true, { expires: 14 });
      //   } else {
      //   // reset cookies
      //   $.cookie('username', null);
      //   $.cookie('password', null);
      //   $.cookie('remember', null);
      //   }
      localStorage.setItem('activeUserName', data.name );
      ItsEasyApiService.authenticate("user", data, function(successResp) {
  
      if(successResp.data == "Admin"){
        
        $scope.active_user.name = localStorage.getItem('activeUserName');
         localStorage.setItem('executed', 1);
         localStorage.setItem('role', successResp.data);
        $scope.$emit('loginVisibility');
      }else{
        if(successResp.data == "Undefined"){
          toastr.error(" User doesn't exist.");
        }else if(successResp.data == "Email"){
          toastr.error(" Email and password doesn't match.");
        }else if(successResp.data != "Admin"){
          $scope.active_user.name = localStorage.getItem('activeUserName');
           localStorage.setItem('executed', 1);
           localStorage.setItem('role', successResp.data);
          $scope.$emit('loginVisibility');
        }
        
      }
        
  
      }, function(errorResp) {
  
    
        toastr.error('Error while updating Status.');
      });
    };
    

$scope.SearchData={
  searchKey:$scope.search,
  limit:$scope.pageData.limit,
  page:$scope.pageData.page
}
$scope.filterpageData={
  filterPage :" 1",
  filterLimit : $scope.pageData.limit
 }

    
 $scope.getNumberOfPages= function() {
    return Math.ceil($scope.getsearchdealRecord.length /$scope.pageData.limit);
}

$scope.nextPage= function() {
  $scope.currentPage += 1;
  $scope.loadList();
}

$scope.previousPage= function(){
  $scope.currentPage -= 1;
  $scope.loadList();
}
$scope.loadList= function() {
  var begin = (($scope.currentPage - 1) * $scope.pageData.limit);
  var end = begin + $scope.pageData.limit;
item='jobs'
  $scope[item] = $scope.getsearchdealRecord.slice(begin, end);
          $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
       
          $scope.updateTables(item);
  
}
  $scope.filterTable = function(item) {
    

    $scope.SearchData={
      searchKey:$scope.search,
      limit:$scope.pageData.limit,
      page:$scope.filterpageData.filterPage
    }
    $scope.isSearch= true;
    // var searchField,
    //   searchFieldKeys = {
    //     corps: ["name", "corp_code", "city", "state", "zip", "fed_tax_id"],
    //     dealers: ["name", "city", "state", "zip"],
    //     jobs: ["vehicle_vin", "primary_last_name", "vehicle_insurance_company", "dealer_name"]
    //   };

    // searchField = searchFieldKeys[item].filter(function(type) {
    //   return ($scope.search[type] && $scope.search[type].length);
    // })[0];

if(item == 'jobs'){
  $scope.isPreviousPage = true;
  $scope.getdealersFinalRecord=[];
  $scope.getdealersIdRecord={};
   if($scope.SearchData.searchKey.name != undefined){
          ItsEasyApiService.getUsersJobDealRec($scope.SearchData, function(successResp) {
               $scope.getsearchdealRecord = successResp.data;
 numberOfPages = $scope.getNumberOfPages();
 $scope.showMECount = $scope.pageData.limit;

            $scope[item] = $scope.getsearchdealRecord;
          $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
          $scope.updateTables(item); 
          }, function(errorResp) {
            toastr.error('Data Not Found');
          });
          
        // }
        // }
    //    }, function(errorResp) {
    //   toastr.error('Data Not Found');
    // });
  }else{
  ItsEasyApiService.getUsersJobRec( $scope.SearchData, function(successResp) {
    
     $scope.jobsRecord = successResp.data;
    $scope.showMECount = $scope.pageData.limit;
    if($scope.jobsRecord.length != 0){
      for(var i=0; i <  $scope.jobsRecord.length; i++ ){
        $scope.holdDealerId = $scope.jobsRecord[i];
        if( $scope.holdDealerId.dealer_id != undefined ){
          if( $scope.holdDealerId.dealer_id != undefined ){
            ItsEasyApiService.getdealerRec( $scope.holdDealerId.dealer_id, function(successResp) {
              $scope.getdealersIdRecord = successResp.data;
              $scope.getdealersFinalRecord.push($scope.getdealersIdRecord);
              if($scope.getdealersFinalRecord.length >0){
                for(var j=0 ; j<$scope.getdealersFinalRecord.length; j++){
          
    Object.assign( $scope.jobsRecord[j], {dealer_name:$scope.getdealersFinalRecord[j].name});
                 // $scope.getjobsRecord[j].map($scope.getdealersFinalRecord[j].name);
                }
                $scope[item] = $scope.jobsRecord;
                $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
            
            $scope.updateTables(item);
            
              }
    
            }, function(errorResp) {
              toastr.error('Data Not Found');
            });
          }else{
            $scope.getjobsRecord.push($scope.getdealersFinalRecord);
  
            $scope[item] = $scope.getjobsRecord;
            $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
         
            $scope.updateTables(item);
        
          }
        }
        
      }
    }else{
      $scope[item] = $scope.jobsRecord;
          $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
       
          $scope.updateTables(item);
      
    }
   
     }, function(errorResp) {
    toastr.error('Data Not Found');
  });
  }
  
}
else if (item == 'dealers'){
  ItsEasyApiService.getUsersDealerRec( $scope.SearchData, function(successResp) {
    // debugger
    $scope[item] = successResp.data;
    $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
    $scope.updateTables(item);

  }, function(errorResp) {
    toastr.error('Data Not Found');
  });
}
else if(item=='corps'){
  ItsEasyApiService.getUsersCorpRec( $scope.SearchData, function(successResp) {
    // debugger
    $scope[item] = successResp.data;
    $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
 
    $scope.updateTables(item);

  }, function(errorResp) {
    toastr.error('Data Not Found');
  });
}
 else if(item=='archive'){
  var item="jobs";
  $scope.getdealersFinalRecord=[];
  $scope.getdealersIdRecord={};
   if($scope.SearchData.searchKey.name != undefined){
          ItsEasyApiService.getUsersJobDealRec($scope.SearchData, function(successResp) {
               $scope.getsearchdealRecord = successResp.data;
 numberOfPages = $scope.getNumberOfPages();
 $scope.showMECount = $scope.pageData.limit;

            $scope[item] = $scope.getsearchdealRecord;
          $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
          $scope.updateTables(item); 
          }, function(errorResp) {
            toastr.error('Data Not Found');
          });
          
        // }
        // }
    //    }, function(errorResp) {
    //   toastr.error('Data Not Found');
    // });
  }else{
  ItsEasyApiService.getUsersArchRec( $scope.SearchData, function(successResp) {
    
     $scope.jobsRecord = successResp.data;
    $scope.showMECount = $scope.pageData.limit;
    if($scope.jobsRecord.length != 0){
      for(var i=0; i <  $scope.jobsRecord.length; i++ ){
        
        $scope.holdDealerId = $scope.jobsRecord[i];
        if( $scope.holdDealerId.dealer_id != undefined ){
          if( $scope.holdDealerId.dealer_id != undefined ){
            ItsEasyApiService.getdealerRec( $scope.holdDealerId.dealer_id, function(successResp) {
              $scope.getdealersIdRecord = successResp.data;
              $scope.getdealersFinalRecord.push($scope.getdealersIdRecord);
              if($scope.getdealersFinalRecord.length >0){
                for(var j=0 ; j<$scope.getdealersFinalRecord.length; j++){
          
    Object.assign( $scope.jobsRecord[j], {dealer_name:$scope.getdealersFinalRecord[j].name});
                 // $scope.getjobsRecord[j].map($scope.getdealersFinalRecord[j].name);
                }
                $scope[item] = $scope.jobsRecord;
                $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
            
            $scope.updateTables(item);
            
              }
    
            }, function(errorResp) {
              toastr.error('Data Not Found');
            });
          }else{
            $scope.getjobsRecord.push($scope.getdealersFinalRecord);
  
            $scope[item] = $scope.getjobsRecord;
            $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
         
            $scope.updateTables(item);
        
          }

        }
        
      }
    }else{
      $scope[item] = $scope.jobsRecord;
          $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
       
          $scope.updateTables(item);
      
    }
   
     }, function(errorResp) {
    toastr.error('Data Not Found');
  });
  }
  
}
// {
//   ItsEasyApiService.getUsersArchRec( $scope.SearchData, function(successResp) {
//     debugger
// var item="jobs";
// $scope[item] = successResp.data;
// $scope["all_" + item] = JSON.parse(JSON.stringify($scope[item]));
//     $scope.updateTables(item);

//   }, function(errorResp) {
//     toastr.error('Data Not Found');
//   });
// }
    
    
  };

      // $scope[item] = $scope["all_" + item].filter(function(obj) {
      //   var shouldReturnObj = false;
      //   var searchFieldValue = $scope.search[searchField];


      //   if (item === "jobs" && searchField === "dealer_name") {
      //     var dealerId = obj.dealer_id;
      //     if (obj.dealer_id == dealerId) {
      //       var dealer = $scope.all_dealers.filter(function(dealer) {
      //         return (("" + dealerId) === ("" + dealer._id));
      //       })[0];
      //       if (dealer && dealer.name.toLowerCase().indexOf(searchFieldValue.toLowerCase()) === 0) {
      //         shouldReturnObj = true;
      //       }
      //     }
      //   } else if (obj[searchField] && (obj[searchField].toLowerCase().indexOf(searchFieldValue.toLowerCase()) === 0)) {
      //     shouldReturnObj = true;
      //   }
      //   return shouldReturnObj;
      // });

      // $scope.updateTables(item);
      // $scope.showEntriesCount = $scope.tables[$scope.activeView].current_page_data.length <= $scope.tables[$scope.activeView].total_items;
      
      $scope.showMECount = 5;
  $scope.clearFilter = function(rec, arch) {

    if (rec == 'dashboard'){
      $scope.isPreviousPage = false;
      $scope.isSearch = false;
      ["jobs","dealers","corps","users"].forEach(function(item) {
        $scope[item] = $scope["all_" + item];
        if(item==="jobs"){
           $scope.pageData.page = 1;
          // $scope.PageChangeData.totalDataPerPage =5;
           $scope.filterpageData.filterPage =1;
          // $scope.filterpageData.filterLimit =5;
          // $scope.pageData.limit = 5;
          //$scope.pageSizeSelected.name = 5;
          //$scope.pageSizeSelected = $scope.ChangePageSize[0];
         // $scope.showMECount = $scope.pageSizeSelected.name;
         if(arch =='archive'){
          $scope.getAllArchive();
         }else{
          $scope.getAll();
         }
          
        }
        if(item==="dealers"){
           $scope.pageData.page = 1;
          // $scope.PageChangeData.totalDataPerPage =5;
           $scope.filterpageData.filterPage =1;
          // $scope.filterpageData.filterLimit =5;
          // $scope.pageData.limit = 5;
          //$scope.pageSizeSelected.name = 5;
        // $scope.pageSizeSelected = $scope.ChangePageSize[0];
          $scope.showPrev = false;
          $scope.getAllDealers();
        }
        if(item==="corps"){
           $scope.pageData.page = 1;
          // $scope.PageChangeData.totalDataPerPage =5;
           $scope.filterpageData.filterPage =1;
          // $scope.filterpageData.filterLimit =5;
           //$scope.pageData.limit = $scope.pageSizeSelected.name;
          //$scope.pageSizeSelected={};
          //$scope.pageSizeSelected.name = 5;
         // $scope.pageSizeSelected = $scope.ChangePageSize[0];
          $scope.showPrev = false;
          $scope.getAllCorps();
        }
        if(item==="users"){
           $scope.pageData.page = 1;
          // $scope.PageChangeData.totalDataPerPage =5;
          $scope.filterpageData.filterPage =1;
          // $scope.filterpageData.filterLimit =5;
          // $scope.pageData.limit = 5;
          //$scope.pageSizeSelected.name = 5;
          $scope.getAllUsers();
        }
        // $scope.updateTables(item);
        $scope.search = {};
        
  
      });
    }else{         
       $scope.showMECount = 5;
      $scope.isSearch = false;
      ["jobs","dealers","corps","users"].forEach(function(item) {
        $scope[item] = $scope["all_" + item];
        if(item==="jobs"){
          $scope.pageData.page = 1;
          $scope.PageChangeData.totalDataPerPage =5;
          $scope.filterpageData.filterPage =1;
          $scope.filterpageData.filterLimit =5;
          $scope.pageData.limit = 5;
          $scope.pageSizeSelected.name = 5;
          //$scope.pageSizeSelected = $scope.ChangePageSize[0];
          $scope.showMECount = 5;
          $scope.getAll();
        }
        if(item==="dealers"){
          $scope.pageData.page = 1;
          $scope.PageChangeData.totalDataPerPage =5;
          $scope.filterpageData.filterPage =1;
          $scope.filterpageData.filterLimit =5;
          $scope.pageData.limit = 5;
          $scope.pageSizeSelected.name = 5;
        // $scope.pageSizeSelected = $scope.ChangePageSize[0];
          $scope.showPrev = false;
          $scope.getAllDealers();
        }
        if(item==="corps"){
          $scope.pageData.page = 1;
          $scope.PageChangeData.totalDataPerPage =5;
          $scope.filterpageData.filterPage =1;
          $scope.filterpageData.filterLimit =5;
           $scope.pageData.limit = 5;
          //$scope.pageSizeSelected={};
          $scope.pageSizeSelected.name = 5;
         // $scope.pageSizeSelected = $scope.ChangePageSize[0];
          $scope.showPrev = false;
          $scope.getAllCorps();
        }
        if(item==="users"){
          $scope.pageData.page = 1;
          $scope.PageChangeData.totalDataPerPage =5;
          $scope.filterpageData.filterPage =1;
          $scope.filterpageData.filterLimit =5;
          $scope.pageData.limit = 5;
          $scope.pageSizeSelected.name = 5;
          $scope.getAllUsers();
        }
        // $scope.updateTables(item);
        $scope.search = {};
        
  
      });
    }
   
   
    $scope.showEntriesCount = $scope.tables[$scope.activeView].current_page_data.length <= $scope.tables[$scope.activeView].total_items;
    $scope.$apply();
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

  $scope.clearCorpLessor = function(event) {
    event.preventDefault();
    event.stopPropagation();
    if ($scope.activeView === "jobs") {
      $scope.current_corp = null;
      $scope.current_job.lessor_id = null;
      
      $scope.save("job","fromLessor");
    }
  };

  $scope.clearCorpLiens = function(event) {
    event.preventDefault();

    event.stopPropagation();
    if ($scope.activeView === "jobs") {
      $scope.current_corp = null;
       $scope.current_job.lien_id = null;
      $scope.save("job", "fromLein");
    }
  };


  // $scope.nameCheckInterval = $interval(function() {
  //   $scope.logincontact.email.$viewValue =  sessionStorage.username
  //   $scope.logincontact.userPass.$viewValue =  sessionStorage.userPass
  // }, 8000);

}]);