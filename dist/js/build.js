var App=angular.module("Fresher",["ngRoute","ngAnimate"]);App.controller("compareCtrl",["$scope","$location","$q","moviesService","stateService",function(e,t,r,i,o){"use strict";var a=this,n=t.search();n&&n.movie1&&n.movie2&&(o.setAllLoadingState(),r.all([i.getMovieDataById(n.movie1),i.getMovieDataById(n.movie2)]).then(function(e){i.save(e[0].data,0),i.save(e[1].data,1),o.clearAllLoadingState()},function(e){console.log(e),a.movies[0]={},a.movies[1]={}})),a.closeOverlay=function(){o.clearAllLoadingState(),o.setSearchState(!1),o.setMoreState(!1)},a.setBestWorstClass=function(e){return null!==a.state.bestMovie?a.state.bestMovie===e?"is-best":"is-worst":""},a.getMovieAtPos=i.getMovieAtPos,a.movies=i.getMovies(),a.state=o.getState()}]),App.controller("headerCtrl",["$location","moviesService","stateService",function(e,t,r){"use strict";var i=this;i.reset=function(){t.clearMovies(),t.clearUrlParams(),r.setMoreState(!1),r.setSearchState(!1),r.clearAllLoadingState()};e.search();i.movies=t.getMovies()}]),App.controller("searchCtrl",["$scope","$timeout","moviesService","stateService",function(e,t,r,i){"use strict";var o=this;o.results=null,o.clear=function(){o.results=null,o.text=""},o.start=function(){if(o.text){i.setSearchQueryState(!0);var e=r.search(o.text);e.success(function(e){o.results=e.results,i.setSearchQueryState(!1)}).error(function(){console.log("error"),i.setSearchQueryState(!1)})}},o.use=function(e){r.save(o.results[e],o.state.searchActiveId)&&(i.setSearchState(!1),o.clear())},o.state=i.getState()}]),App.directive("addMovie",["stateService",function(e){"use strict";return{restrict:"E",replace:"true",scope:{movie:"=",id:"@"},bindToController:!0,templateUrl:"partials/add-movie.html",link:function(t,r,i){t.add=function(){e.setSearchState(!0,t.id),e.setLoadingState(t.id,!0)}}}}]),App.directive("movieFull",["moviesService","stateService",function(e,t){"use strict";return{restrict:"E",replace:"true",scope:!0,templateUrl:"partials/movie-full.html",link:function(r,i,o){r.movie={},r.close=function(){t.setMoreState(!1)},r.$watch(t.getState,function(t,i){t&&t.activeMovie&&(r.movie=e.getCachedMovieDataById(t.activeMovie))},!0)}}}]),App.directive("movieTile",["moviesService","stateService","$timeout",function(e,t,r){"use strict";return{restrict:"E",replace:"true",scope:{movie:"="},templateUrl:"partials/movie-tile.html",link:function(r,i,o){r.more=function(){t.setMoreState(!0),t.setActiveMovie(r.movie.id)},r.remove=function(t){e.remove(t),e.clearUrlParams(),e.clearBestMovie()},r.getPosterUrl=e.getPosterUrl,r.getRatingFormatted=e.getRatingFormatted}}}]),App.filter("prettyTime",function(){"use strict";return function(e){if(void 0===e||0===e.length)return e;e=Number(e);var t=Math.floor(e/60),r=60*t,i=Math.round(e-r);return t+" hr. "+i+" min."}}),App.filter("yearOnly",function(){"use strict";return function(e){return void 0!==e&&e?e.split("-")[0]:e}}),App.config(["$routeProvider",function(e){"use strict";e.when("/",{templateUrl:"partials/main.html",reloadOnSearch:!1}),e.otherwise({redirectTo:"/"})}]),App.service("moviesService",["$http","$location","stateService",function(e,t,r){"use strict";window.APIKEY=window.APIKEY?window.APIKEY:"12345";var i=[],o={},a="http://api.themoviedb.org/3/search/movie?query=%SEARCH%&api_key=%APIKEY%",n="http://api.themoviedb.org/3/movie/%ID%?api_key=%APIKEY%&callback=JSON_CALLBACK",c="http://image.tmdb.org/t/p/w500/%URL%";return o.getMovies=function(){return i},o.getMovieAtPos=function(e){return i[0]&&i[0].pos===e?i[0]:i[1]&&i[1].pos===e?i[1]:null},o.clearMovies=function(){i.length=0},o.isMovieCached=function(e){var t=_.filter(i,function(t){return t.id===e});return t.length},o.save=function(e,t){var a;return o.isMovieCached(e.id)?(alert("this movie is already in your comparison.\nPlease choose another"),!1):(o.clearUrlParams(),o.clearBestMovie(),o.getMovieDataById(e.id).then(function(e){var n=e.data;null!==t&&void 0!==t&&(a=parseInt(t,10)),n.pos=a,n.year=n.release_date.split("-")[0],i[i.length]=n,r.clearAllLoadingState(),2===i.length&&(o.addComparisonToUrl(),o.highlightBestMovie())},function(e){alert("error occurred")}),!0)},o.addComparisonToUrl=function(){t.search({movie1:i[0].id,movie2:i[1].id})},o.highlightBestMovie=function(){var e=null;i[0].vote_average>i[1].vote_average&&(e=0),i[0].vote_average<i[1].vote_average&&(e=1),null!==e&&r.setBestMovie(parseInt(i[e].pos,10))},o.clearBestMovie=function(){r.clearBestMovie()},o.clearUrlParams=function(){t.search({})},o.remove=function(e){var t=-1;_.find(i,function(r,i){r.id===e&&(t=i)}),-1!==t&&i.splice(t,1)},o.getSearchUrl=function(e){return a.replace(/%SEARCH%/,e).replace(/%APIKEY%/,APIKEY)},o.getMovieUrl=function(e){return n.replace(/%ID%/,e).replace(/%APIKEY%/,APIKEY)},o.getPosterUrl=function(e){return e?c.replace(/%URL%/,e):""},o.search=function(t){var r=o.getSearchUrl(t);return e.get(r)},o.getCachedMovieDataById=function(e){return _.find(i,function(t){return t.id===e})},o.getMovieDataById=function(t){var r=o.getMovieUrl(t);return e.jsonp(r)},o.getRatingFormatted=function(e){var t="certified",r="fresh",i="rotten";return"Certified Fresh"===e?t:"Fresh"===e?r:i},o}]),App.service("stateService",[function(){"use strict";var e={},t={searchActive:!1,searchActiveId:null,searchQueryActive:!1,moreActive:!1,activeMovie:null,bestMovie:null,loading:[!1,!1]};return e.getState=function(){return t},e.setSearchState=function(e,r){t.searchActive=e,t.searchActiveId=r||null},e.setSearchQueryState=function(e){t.searchQueryActive=e},e.setMoreState=function(e){t.moreActive=e},e.setActiveMovie=function(e){t.activeMovie=e},e.setLoadingState=function(e,r){t.loading[e]=r},e.setAllLoadingState=function(){e.setLoadingState(0,!0),e.setLoadingState(1,!0)},e.clearAllLoadingState=function(){e.setLoadingState(0,!1),e.setLoadingState(1,!1)},e.setBestMovie=function(e){t.bestMovie=e},e.clearBestMovie=function(){t.bestMovie=null},e}]);