angular.module('choreApp', ['routerRoutes'])

.controller('mainController', function( ){
	var vm = this;
	vm.message = 'this is the main controller boi';
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
