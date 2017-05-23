var app = angular.module('travelApp', ['ngAnimate', 'ui.router', 'simplePagination']);

app.controller('MainController', ['$scope', '$timeout', '$filter', 'OfferService', 'MaxOfferPriceService', 'orderByFilter', 'priceComparisonFilter', 'dateRangeCheckFilter', '$http', '$state', function($scope, $timeout, $filter, OfferService, MaxOfferPriceService, orderBy, priceComparisonFilter, dateRangeCheckFilter, $http, $state) {
  var initRangeSlider = function() {
    $('#rangeslider').ionRangeSlider({
      type: "double",
      grid: true,
      min: 0,
      max: 1000,
      from: 20,
      to: 900,
      prefix: "€ ",
      onFinish: function(data) {
        $scope.rangeSliderFinish(data.from, data.to);
      }
    });
  };

  var initDateRangePicker = function() {
    $('#periodpicker')
      .dateRangePicker({
        language: 'en',
        format: 'DD-MM-YYYY',
        startOfWeek: 'monday'
      })
      .bind('datepicker-change', function(event, obj) {
        $timeout(
          function() {
            counterCurrentState = $scope.offers.length;
            $scope.offers = dateRangeCheckFilter($scope.allOffers, obj);

            // Counter animation
            $('.timecounter').countTo({
              from: counterCurrentState,
              to: $scope.offers.length
            });
          },
          0
        );
      });;
  };

  var bootstrap = function() {
    initDateRangePicker();
    initRangeSlider();
  }();

  $scope.offersLoaded = false;
  $scope.imgPlaceHolder = 'img/image-placeholder.png';
  $scope.propertyName = '';
  $scope.reverse = '';

  OfferService.getOffers().then(function(data) {
    $scope.allOffers = data
    $scope.offersLoaded = true;
    $scope.offers = orderBy(data, $scope.propertyName, $scope.reverse);
    $scope.timeCounterCurrentState = $scope.offers.length;

    // Counter animation
    $('.timecounter').countTo({
      from: 0,
      to: $scope.offers.length
    });

    // Update rangeSlider
    var slider = $('#rangeslider').data('ionRangeSlider');
    slider.update({
      max: MaxOfferPriceService.getMaxPrice( $scope.offers )
    });    
  });


  $scope.sortBy = function(value) {
    if( value === 'pasc' ) {
      $scope.offers = orderBy($scope.offers, 'price', false);
    } else if( value === 'pdesc' ) {
      $scope.offers = orderBy($scope.offers, 'price', true);
    }
  };

  $scope.rangeSliderFinish = function(min, max) {
    $timeout(
      function() {
        $scope.offers = priceComparisonFilter($scope.allOffers, min, max);

        // Counter animation
        $('.timecounter').countTo({
          from: $scope.timeCounterCurrentState,
          to: $scope.offers.length
        });
        $scope.timeCounterCurrentState = $scope.offers.length;
      },
      0
    );
  };
}]);

app.controller('OfferDetailController', ['$scope', '$stateParams', 'OfferService', 'AirportService', 'FlightService', '$http', '$filter', 'Pagination', function($scope, $stateParams, OfferService, AirportService, FlightService, $http, $filter, Pagination) {
  $scope.hasResults = false;
  $scope.offer = OfferService.getOffer( $stateParams.offerId );
  $scope.pagination = Pagination.getNew();
  document.title = $scope.offer.name + ' - Travel Finder';

  AirportService.search();

  var initDatePicker = function() {
    $('#travel-date-start').dateRangePicker({
      autoClose: true,
      showShortcuts: false,
      startDate: new Date(),
      language: 'en',
      format: 'YYYY-MM-DD',
      startOfWeek: 'monday',
      separator : ' to ',
      getValue: function() {
        if( $('#travel-date-start').val() && $('#travel-date-end').val() ) {
          return $('#travel-date-start').val() + ' to ' + $('#travel-date-end').val();
        } else {
          return '';
        }
      },
      setValue: function(s, s1, s2) {
        $('#travel-date-start').val( s1 );
        $('#travel-date-end').val( s2 );
      }
    });
  };

  var formValidation = function() {
    $('.search-flight-form form').form({
      fields: {
        flightorigin: 'empty',
        flightdestination: 'empty',
        flightdatestart: 'empty',
        flightdateend: 'empty'
      }
    });
  };

  var initPopup = function() {
    $('[data-content]').popup();
  };

  var bootstrap = function() {
    initDatePicker();
    formValidation();
    initPopup();
  }();

  $scope.getFlights = function(element) {
    if( $('.search-flight-form form').form('is valid') ) {
      $('#search-flight').addClass('loading');

      $scope.userRequest = {
        "request": {
          "passengers": {
            "adultCount": 1
          },
          "slice": [
            {
              "origin": $('input[name="travelstarthidden"]').val(),
              "destination": $('input[name="travelendhidden"]').val(),
              "date": $('#travel-date-start').val()
            },
            {
              "origin": $('input[name="travelendhidden"]').val(),
              "destination": $('input[name="travelstarthidden"]').val(),
              "date": $('#travel-date-end').val()
            }
          ]
        }
      };

      FlightService.getFlights($scope.userRequest).then(function(response) {
        $scope.flights = response.data.trips.tripOption;
        $scope.pagination.numPages = Math.ceil( $scope.flights.length/$scope.pagination.perPage );
        $('#search-flight').removeClass('loading');
        $scope.hasResults = true;
      });
    }
  };
}]);

app.animation('.card', [function() {
  var doneFn = function() {
    console.log( 'hello' );
  };

  return {
    enter: function(element, doneFn) {
      /*
      jQuery(element).addClass('animated fadeInUp');
      jQuery(element).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        jQuery(this).removeClass('animated fadeInUp');
      });
      */
    },
    move: function(element, doneFn) {
      /*jQuery(element).addClass('animated zoomOut');
      jQuery(element).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        jQuery(this).removeClass('animated zoomOut');
      });*/
    },
    leave: function(element, doneFn) {
      /*jQuery(element).addClass('animated fadeOutDown');
      jQuery(element).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        jQuery(this).removeClass('animated fadeOutDown');
      });*/
    }
  };
}]);


/* ##### JS librairies ##### */

var initDropdown = function() {
  $('select.dropdown').dropdown();
};

var initSticky = function() {
  $('.ui.sticky').sticky({
    context: '#context'
  });
};

var init = function() {
  initDropdown();
  initSticky();
}();