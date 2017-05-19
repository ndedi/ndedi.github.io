app.service('StorageService', function() {
  return {
    saveData: function(indexName, list) {
      sessionStorage.setItem(indexName, JSON.stringify(list));
    },

    retrieveData: function(indexName) {
      return JSON.parse( sessionStorage.getItem(indexName) );
    }
  };
});

app.service('AirportService', function($http) {
  var allAirports = [];

  return {
    search: function() {
      $http.get('data/airports.json').then(
        function(response) {
          allAirports = response.data;

          $('.search-flight-form .ui.search').search({
            source: response.data,
            minCharacters: 2,
            searchFields: ['municipality', 'title'],
            onSelect: function(response) {
              $(this).find('input[type="hidden"]').val( response.iata_code );
            }
          });
        },
        function(response) {
          console.log( response );
        }
      );
    },

    getAirport: function(item) {
      // Implement a mapping
      var selectedAirport = allAirports.map(function(item) {
        
      });
    }
  }
});

app.service('FlightService', function($http) {
  return {
    getFlights: function(userRequest) {
      return $http.post('https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyCjTr8oRR8sp4Zw3GSmu6v8bAIJkmoPbyg', userRequest).then(
        function(response) {
          return response;
        },
        function(response) {
          console.log( response );
        }
      );
    }
  }
});

app.service('OfferService', function($http, StorageService) {
  var allOffers = [];

  return {
    getOffers: function() {
      return $http.get('data/load-offers.php').then(
        function(response) {
          var splitOutput, tmpString, results;

          results = response.data.map(function(item) {
            moment.locale('fr');

            // Parse price
            item.price = Number( item.price );

            // Parse link
            if( item.source === 'Thomas Cook' ) {
              item.link = 'http://www.thomascook.fr/' + item.link;
            }

            // Parse img
            if( item.source === 'Havas' ) {
              if( item.img.indexOf('http://www.havas-voyages.fr') < 0 ) {
                item.img = 'http://www.havas-voyages.fr' + item.img;
              }
            }

            // Parse date
            if( item.source === 'Thomas Cook' ) {
              item.date = moment(item.date, 'DD MMM YYYY');
            } else if( item.source === 'Pierre & Vacances' ) {
              splitOutput = item.date.split(' au ');
              tmpString = splitOutput[0] + ' ' + moment().get('year');
              item.date = moment(tmpString.substring(4), 'DD MMMM YYYY');
            }

            moment.locale('en');
            
            return item;
          });

          allOffers = results;
          StorageService.saveData( 'travelfinder-offers', allOffers );

          return results;
        },
        function(response) {
          console.log( response );
        }
      );
    },

    getOffer: function(itemId) {
      if( allOffers.length === 0 ) {
        allOffers = StorageService.retrieveData('travelfinder-offers');
      }

      for( var i in allOffers ) {
        if( allOffers[i].id === Number(itemId) ) {
          return allOffers[i];
        }
      }
    }
  };
});

app.service('MaxOfferPriceService', function() {
  return {
    getMaxPrice: function(list) {
      var allPrices = [],
          offerPrice,
          output;

      angular.forEach(list, function(offer) {
        offerPrice = parseInt( offer.price );

        if( Number.isInteger(offerPrice) ) {
          allPrices.push( offerPrice );
        }
      });

      return Math.max.apply(null, allPrices);
    }
  };
});