angular.module('routerRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'angular/views/pages/home.html',
			controller: 'homeController',
			controllerAs: 'home'
		})
		.when('/about', {
			templateUrl: 'angular/views/pages/about.html',
			controller: 'aboutController',
			controllerAs: 'about'
		})
		.when('/contact', {
			templateUrl: 'angular/views/pages/contact.html',
			controller: 'contactController',
			controllerAs: 'contact'
		});

	//set app to have nice URLs (<base> tag in index.html)
	//use HTML5 history API so there's no hashtag
	$locationProvider.html5Mode(true);
});
