angular.module('starter')
  .directive("imgSizeService", function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attr) {
        console.log("jlsfj")
        elem.on('load', function () {
          var w = $(this).width(),
            h = $(this).height()


          if(w > h) {
            $(this).css('width','100%');
            $(this).css('height','80%');
          }
          else {
            $(this).css('height','100%');
            $(this).css('width','80%');
            // $(this).css('max-width','130px');
          }
        })
      }
    }
  });
