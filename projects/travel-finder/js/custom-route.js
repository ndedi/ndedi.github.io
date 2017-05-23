app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partial/home/home.html',
      controller: 'MainController'
    })
    
    .state('offer', {
      url: '/offers/:offerId',
      templateUrl: 'partial/offers/offers.detail.html',
      controller: 'OfferDetailController'
    });
});