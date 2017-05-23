app.filter('priceComparison', function() {
  return function(input, minLimit, maxLimit) {
    input = input || '';
    var out = [];

    angular.forEach(input, function(offer) {
      if( (offer.price >= minLimit) && (offer.price <= maxLimit) ) {
        out.push( offer );
      }
    });

    return out;
  };
});

app.filter('dateRangeCheck', function() {
  return function(input, userDate) {
    input = input || '';
    var out = [],
        startDate, endDate;

    angular.forEach(input, function(offer) {
      if( (moment(userDate.date1).isSameOrBefore(offer.date, 'day')) && (moment(userDate.date2).isSameOrAfter(offer.date, 'day')) ) {
        out.push( offer );
      }
    });

    return out;
  }
});