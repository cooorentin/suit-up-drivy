/*eslint-disable space-unary-ops*/
'use strict';

var DRIVY = DRIVY || {};

var cars = [{
	id: 'lsmrt',
	name: 'Smart Fortwo',
	img: 'C:/Users/cooorentin/Desktop/suit-up-drivy/public/img/smartfortwo.jpg',
	pricePerDay: 25, 
	pricePerKm: 0.12
}, {
	id: 'p208',
	name: 'Peugeot 208',
	img: 'C:/Users/cooorentin/Desktop/suit-up-drivy/public/img/peugeot208.jpg', 
	pricePerDay: 30,
	pricePerKm: 0.17
}]

DRIVY = (function namespace () {
  var MS_PER_DAY = 1000 * 60 * 60 * 24;

  /**
   * Get car information
   *
   * @return {Object}
   */
  var getCar = function getCar () {
    return {
      'model': document.querySelector('#car .model').value,
      'pricePerDay': document.querySelector('#car .price-by-day').value,
      'pricePerKm': document.querySelector('#car .price-by-km').value
    };
  };

  /**
   * Number of rental days from begin and end date
   *
   * @param  {Date} begin
   * @param  {Date} end
   * @return {Integer}
   */
  var getDays = function getDays (begin, end) {
    begin = new Date(begin).getTime();
    end = new Date(end).getTime();

    return Math.floor((end - begin) / MS_PER_DAY) + 1;
  };

  /**
   * Get discount percent according days
   *
   * @param  {Number} days
   * @return {Number}
   */
  var discount = function discount (days) {
    if (days > 10) {
      return 0.5;
    }

    if (days > 4) {
      return 0.3;
    }

    if (days > 1) {
      return 0.1;
    }

    return 0;
  };

  /**
   * Compute commission
   *
   * @param  {Number} price
   * @param  {Number} days
   * @return {Object}
   */
  var rantalCommission = function rantalCommission (price, days) {
    var value = ~~(price * 0.3).toFixed(2);
    var insurance = ~~(value * 0.5).toFixed(2);
    var assistance = 1 * days;

    return {
      'value': value,
      'insurance': insurance,
      'assistance': assistance,
      'drivy': ~~(value - insurance - assistance).toFixed(2)
    };
  };

  /**
   * Compute the rental price
   *
   * @param  {Object} car
   * @param  {Date} begin
   * @param  {Date} end
   * @param  {String} distance
   * @return {String} price
   */
  var rentalPrice = function rentalPrice (car, days, distance) {
    var percent = discount(days);
    var pricePerDay = car.pricePerDay - car.pricePerDay * percent;

    return ~~(days * pricePerDay + distance * car.pricePerKm).toFixed(2);
  };

  /**
   * Pay each actors
   *
   * @param  {Object} car
   * @param  {Date} begin
   * @param  {Dare} end
   * @param  {String} distance
   * @param  {Boolean} option
   * @return {Object}
   */
  var payActors = function payActors (car, begin, end, distance, option) {
    option = option || false;

    var days = getDays(begin, end);
    var price = rentalPrice(car, days, distance);
    var commission = rantalCommission(price, days);
    var deductibleOption = option ? 4 * days : 0;

    var actors = [{
      'who': 'driver',
      'type': 'debit',
      'amount': price + deductibleOption
    }, {
      'who': 'owner',
      'type': 'credit',
      'amount': price - commission.value
    }, {
      'who': 'insurance',
      'type': 'credit',
      'amount': commission.insurance
    }, {
      'who': 'assistance',
      'type': 'credit',
      'amount': commission.assistance
    }, {
      'who': 'drivy',
      'type': 'credit',
      'amount': commission.drivy + deductibleOption
    }];

    return actors;
  };

  return {
    'getCar': getCar,
    'payActors': payActors
  };
}());
