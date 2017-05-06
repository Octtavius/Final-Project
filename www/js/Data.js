(function () {
  var Data = function () {
    var cars = [
      {
        car_id: "111",
        imgUrl: "img/mercedes1.png",
        brand: {
          title: "Mercedes-Benz",
          icon: "ion-model-s"
        },
        model: {
          title: "B-Class",
          icon: "ion-pricetag"
        },
        engine: {
          title: "1.6 Diesel "
        },
        price: {
          title: 26877,
          icon: "ion-social-euro"
        },
        year: {
          title: "2017",
          icon: "ion-calendar"
        },
        transmission: {
          title: "Manual"
        },
        // eco: {
        //   title: "Eco",
        //   icon: "ion-leaf"
        // },
        maxSpeed: {
          title: "200",
          icon: "ion-ios-speedometer"
        },
        consumes: {
          title: "7.6/7.4",
          icon: "ion-waterdrop"
        },
        wheelSystem: {
          title: "4x2"
        },
        weight: {
          title: 1960
        }
      },
      {
        car_id: "112",
        imgUrl: "img/Mercedes-AMG-GT-C-Roadster.png",
        brand: {
          title: "Mercedes-Benz",
          icon: "ion-model-s"
        },
        model: {
          title: "AMG GT C Roadster",
          icon: "ion-pricetag"
        },
        engine: {
          title: "3.9 Petrol Twin",
          icon: "ion-"
        },
        price: {
          title: 90000,
          icon: "ion-social-euro"
        },
        year: {
          title: "2017",
          icon: "ion-calendar"
        },
        transmission: {
          title: "Manual",
          icon: "ion-"
        },
        // eco: {
        //   title: "Eco",
        //   icon: "ion-leaf"
        // },
        maxSpeed: {
          title: "316",
          icon: "ion-ios-speedometer"
        },
        consumes: {
          title: "9.5",
          icon: "ion-waterdrop"
        },
        wheelSystem: {
          title: "4x2 Rear-Wheel",
          icon: "ion-"
        },
        weight: {
          title: 2000
        }
      },
      {
        car_id: "113",
        imgUrl: "img/vw_scirocco.png",
        brand: {
          title: "Volkswagen",
          icon: "ion-model-s"
        },
        model: {
          title: "Scirocco",
          icon: "ion-pricetag"
        },
        engine: {
          title: "2.0 Diesel ",
          icon: "ion-"
        },
        price: {
          title: 27500,
          icon: "ion-social-euro"
        },
        year: {
          title: "2017",
          icon: "ion-calendar"
        },
        transmission: {
          title: "Manual"
        },
        // eco: {
        //   title: "Eco",
        //   icon: "ion-leaf"
        // },
        maxSpeed: {
          title: "230",
          icon: "ion-ios-speedometer"
        },
        consumes: {
          title: "5.4",
          icon: "ion-waterdrop"
        },
        wheelSystem: {
          title: "4x2 Front-Wheels"
        },
        weight: {
          title: 1800
        }
      },
      {
        car_id: "114",
        imgUrl: "img/volkswagen_beetle.png",
        brand: {
          title: "Volkswagen",
          icon: "ion-model-s"
        },
        model: {
          title: "Beetle",
          icon: "ion-pricetag"
        },
        engine: {
          title: "2.0 Petrol(Gasoline) ",
          icon: "ion-"
        },
        price: {
          title: 20000,
          icon: "ion-social-euro"
        },
        year: {
          title: "2016",
          icon: "ion-calendar"
        },
        transmission: {
          title: "Manual",
          icon: "ion-"
        },
        // eco: {
        //   title: "Eco",
        //   icon: "ion-leaf"
        // },
        maxSpeed: {
          title: "185",
          icon: "ion-ios-speedometer"
        },
        consumes: {
          title: "8.7",
          icon: "ion-waterdrop"
        },
        wheelSystem: {
          title: "4x2 Front-Wheel",
          icon: "ion-"
        },
        weight: {
          title: 16500
        }
      },
      {
        car_id: "115",
        imgUrl: "img/bmw-i3.png",
        brand: {
          title: "BMW",
          icon: "ion-model-s"
        },
        model: {
          title: "i3",
          icon: "ion-pricetag"
        },
        engine: {
          title: "Electric",
          icon: "ion-"
        },
        price: {
          title: 35000,
          icon: "ion-social-euro"
        },
        year: {
          title: "2017",
          icon: "ion-calendar"
        },
        transmission: {
          title: "Manual Single Speed"
        },
        // eco: {
        //   title: "Eco",
        //   icon: "ion-leaf"
        // },
        maxSpeed: {
          title: "160",
          icon: "ion-ios-speedometer"
        },
        consumes: {
          title: "0.6",
          icon: "ion-waterdrop"
        },
        wheelSystem: {
          title: "4x2 Rear-Wheels"
        },
        weight: {
          title: 1300
        }
      },
      {
        car_id: "116",
        imgUrl: "img/A7.png",
        brand: {
          title: "Audi",
          icon: "ion-model-s"
        },
        model: {
          title: "A7",
          icon: "ion-pricetag"
        },
        engine: {
          title: "3.0 Diesel",
        },
        price: {
          title: 63000,
          icon: "ion-social-euro"
        },
        year: {
          title: "2017",
          icon: "ion-calendar"
        },
        transmission: {
          title: "Manual 7 Speed",
          icon: "ion-"
        },
        maxSpeed: {
          title: "240",
          icon: "ion-ios-speedometer"
        },
        consumes: {
          title: "4.7",
          icon: "ion-waterdrop"
        },
        wheelSystem: {
          title: "4x2 Front-Drive",
          icon: "ion-"
        },
        weight: {
          title: 2300
        }
      }
    ];

    var byId = function (id) {
      console.log(id);
      for(var i=0;i<cars.length;i++){
        if(cars[i].car_id===id){
          return cars[i];
        }
      }
    }

    var getCars = function () {
      return cars;
    };

    return {
      getAllCars: getCars,
      carById: byId
    }
  };

  var module = angular.module('starter');

  module.factory("Data", Data);
}());
