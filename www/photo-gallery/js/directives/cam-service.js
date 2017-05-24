angular.module('starter')
  .factory("cam", function ($cordovaCamera, StorageService) {
    var allPic = [];
    var tp = function() {
      var options = {
        quality : 90,
        destinationType : Camera.DestinationType.DATA_URL,
        sourceType : Camera.PictureSourceType.CAMERA,
        allowEdit : false,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true,
        // targetWidth: 300,
        // targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        allPic.push("data:image/jpeg;base64," + imageData);
        StorageService.add("data:image/jpeg;base64," + imageData);
      }, function(err) {
        // An error occured. Show a message to the user
      });
    }

    return{
      takePhoto:tp,
      getAllFotos:allPic
    }
  })
