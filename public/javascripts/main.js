'use strict';

var app = angular.module('app', ['ui.router']);

// Define front end routes here
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/templates/home.html'
    });
});

// Start the app
app.run();

app.controller('HomeController', function($scope, $interval) {
  $scope.Math = Math;
  $scope.M = 4;
  $scope.N = 5;
  $scope.chances = 3;
  $scope.T = ($scope.N + 1) * 1000;
  $scope.randList = getRandom($scope.N);

  $scope.validate = function() {
    if($scope.N > Math.pow($scope.M, 2)) {
      $scope.N = $scope.M;
    }
    $scope.T = ($scope.N + 1) * 1000;
  };

  $scope.getCellStyle = function($index, $parent) {
    var style = {};
    if($index == 0) {
      style['border-left'] = '1px solid #111111';
    }
    var current = $parent * $scope.M + $index;
    for(var i = 0; i < $scope.N; i++) {
      if($scope.randList[i] == current) {
        style['background-color'] = '#00AEFF';
        return style;
      }
    }
    return style;
  };

  $scope.getRowStyle = function($index) {
    var style = {
      width: $scope.M * 75 + 1 + 'px'
    };
    if($index == 0) {
      style['border-top'] = '1px solid #111111';
    }
    return style
  };

  // Decolorize a cell after it has been clicked.
  $scope.discard = function($index, $parent) {
    if($scope.T == 0) return false;
    var current = $parent * $scope.M + $index;
    for(var idx in $scope.randList) {
      if($scope.randList[idx] == current) {
        if($scope.randList.length == $scope.N) $scope.startCountDown();
        $scope.randList.splice(idx, 1);
        if($scope.randList.length == 0) {
          $scope.stopCountDown();
          $scope.success = true;
        }
        return true;
      }
    }
    return false;
  };

  /* Get n random items from the grid
  *  grid indexed from 0 to M x M - 1
  *  @param n => number of items to be selected
  *  @param exclude => list of indices to be excluded.
  */
  function getRandom(n, exclude) {
    var len = $scope.M * $scope.M;
    var arr = [];
    var result = [];
    for(var i = 0; i < len; i++) {
      var include = true;
      if(exclude) {
        for(var j = 0; j < exclude.length; j++) {
          if(exclude[j] == i) {
            include = false;
            break;
          }
        }
      }
      if(include) arr.push(i);
    }

    while(result.length < n) {
      var rand = Math.floor(Math.random() * (arr.length - 1));
      result.push(arr[rand]);
      arr.splice(rand, 1);
    }
    return result;
  };

  var stop;
  $scope.startCountDown = function() {
    $scope.chances--;
    stop = $interval(function() {
      $scope.T -= 100;
    }, 100, $scope.T/100);
  };

  $scope.stopCountDown = function() {
    if (angular.isDefined(stop)) {
      $interval.cancel(stop);
      stop = undefined;
    }
  };

  $scope.reset = function() {
    $scope.stopCountDown();
    $scope.M = 4;
    $scope.N = 5;
    $scope.chances = 3;
    $scope.T = ($scope.N + 1) * 1000;
    $scope.randList = getRandom($scope.N);
  };

  /* Try again if failed in first or second attempt */
  $scope.rechance = function() {
    if($scope.chances == 0) return false;
    if($scope.randList.length == 0) return false;
    $scope.failure = null;
    $scope.T = 1000 * ($scope.N + 1);
    var len = $scope.randList.length;
    var newRand = getRandom(($scope.N - len), $scope.randList);
    for(var x in newRand) {
      $scope.randList.push(newRand[x]);
    }
  };

  /* Make sure that the interval is destroyed too */
  $scope.$on('$destroy', function() {
    $scope.stopCountDown();
  });

  $scope.$watchGroup(['M', 'N'], function() {
    $scope.chances = 3;
    $scope.validate();
    $scope.stopCountDown();
    $scope.randList = getRandom($scope.N);
  });

  $scope.$watch('T', function() {
    if($scope.T == 0 && $scope.randList.length != 0) {
      $scope.failure = true;
    }
  });
});

/* filter to create a dummy list to iterate n times  (using ng-repeat) */
app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i = 0; i < total; i++) {
      input.push(i);
    }
    return input;
  };
});
