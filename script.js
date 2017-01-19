var App = angular.module('weatApp', ["ngRoute"]);

App.config (function ($routeProvider){
    $routeProvider
    .when("/main", {
        templateUrl : "yup.html"
    })
});
App.controller('weatCtrl', function($scope, $http, $interval) {
    $scope.cityArr=['KAUNAS', 'VILNIUS', 'KLAIPEDA', 'SIAULIAI', 'PANEVEZYS'];
    $scope.getCity = function(city){
        var cityLoc={
            'KAUNAS':[54.896706,23.902864],
            'VILNIUS':[54.683830,25.276641], 
            'KLAIPEDA':[55.701653,21.137936], 
            'SIAULIAI':[55.939367,23.291798], 
            'PANEVEZYS':[55.735280,24.359292],
        };
        $scope.temp="Loading...";
        $scope.humi="Loading...";
        $scope.wind="Loading...";
        $scope.sendCity=city;
        var lat = cityLoc[city][0];
        var lon = cityLoc[city][1];
        $scope.url = 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="('+lat+', '+lon+')")&format=json&lang=en&callback=JSON_CALLBACK';
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
        // $interval(function(){
        //     $scope.getLocation();
        // },60000);
        
        };

});


