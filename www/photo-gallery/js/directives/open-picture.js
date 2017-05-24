angular.module('starter')
  .directive("openPicture", function ($ionicModal) {
    return {
      restrict: 'A',
      link: function (scope, elem, attr) {
        $ionicModal.fromTemplateUrl('photo-gallery/templates/my-modal.html', {
          scope: scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          scope.modal = modal;
        });


        scope.openModal = function() {
          scope.modal.show();
        };

        scope.closeModal = function() {
          scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        scope.$on('$destroy', function() {
          scope.modal.remove();
        });

        // Execute action on hide modal
        scope.$on('modal.hidden', function() {
          // Execute action
        });

        // Execute action on remove modal
        scope.$on('modal.removed', function() {
          // Execute action
        });


        console.log("jlsfj")
        elem.on('click', function () {
          scope.theSrc = $(this).children().attr('src');
          scope.modal.show()

        })
      }
    }
  });
