var App = angular.module('weatApp', ["ngRoute"]);
App.controller('weatCtrl', function($scope, $http, $interval) {
    $scope.cityArr=['KAUNAS', 'VILNIUS', 'KLAIPEDA', 'SIAULIAI', 'PANEVEZYS'];
    $scope.getCity = function(city){
        $scope.temp="Loading...";
        $scope.humi="Loading...";
        $scope.wind="Loading...";
        $scope.sendCity=city;
        $scope.url = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"" + city + "\")&format=json&lang=en&callback=JSON_CALLBACK";
        $scope.getLocation = function(){
            $http.jsonp($scope.url)
                .success (function gotSuccess(data){
               try{
                   $scope.check=data.query.results.channel.item.condition.temp;
                   $scope.check=Math.floor(($scope.check - 32) * (5 / 9));
                   $scope.temp=$scope.check+"C°";
                   $scope.humi=data.query.results.channel.atmosphere.humidity + "%";
                   $scope.toKmWind=data.query.results.channel.wind.speed;
                   $scope.toKmWind= Math.floor($scope.toKmWind*1.609344)
                   $scope.wind=$scope.toKmWind+"Km/h";
                   $scope.bg();
               }
               catch (err){
                   $scope.getLocation();
                   }
            });
        };
        $scope.bg = function (){
            if ($scope.check>0){
                $scope.changeColor="plus";
            }
            else if ($scope.check<0){
               $scope.changeColor="minus"; 
            }
            else {
               $scope.changeColor="zero";
            }     
        }
        $scope.getLocation();
        $interval(function(){
            $scope.getLocation();
        },60000);
        
        };

});
App.config (function ($routeProvider){
    $routeProvider
    .when("/main", {
        templateUrl : "yup.html"
    })
});
                           