angular.module('choreApp', [])

.controller('mainController', function(){
	var vm = this;
	vm.message = "yo this is the angular app";
	
})

.controller('homeController', function(){
	var vm = this;
	vm.message = "you're at the home page";
})
.controller('aboutController', function(){
	var vm = this;
	vm.message = "you're at the about page";
})
.controller('contactController', function(){
	var vm = this;
	vm.message = "you're at the contact page";
});
