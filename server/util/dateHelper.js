var moment = require('moment');

var DateHelper = {};

DateHelper.sqlDefaultDateFormat = function(pt_br_date){
  return moment( pt_br_date, 'DD/MM/YYYY' ).format('YYYY-MM-DD');
}

DateHelper.todayDate = function(){
  return moment().format('YYYY-MM-DD');
}

DateHelper.sqlSubtractDate = function(date, length, type){
  return moment( date ).subtract(length,type).format('YYYY-MM-DD');
  //ex.: subtract(1,'days')
}

DateHelper.sqlCurrent15minDate = function() {
  var date = moment();
  var resultDate = round(date, moment.duration(15, "minutes"), "floor");

  return resultDate.format('YYYY-MM-DD H:mm');
}

DateHelper.sqlLast15minTradeDateTime = function() {
  var date = new Date();
  // date.setTime( date.getTime() - date.getTimezoneOffset()*60*1000 );
  date = moment(date);
  var resultDate = round(date, moment.duration(15, "minutes"), "floor");
  var dateTime = resultDate.format('YYYY-MM-DD H:mm');
  var time = parseInt(dateTime.substring(11,13));
  var minutes = parseInt(dateTime.substring(15,17));
  if (time < 10) {
    dateTime = resultDate.subtract(1, 'days').format('YYYY-MM-DD H:mm');
    return dateTime.substring(0,11)+"16:45";
  }
  if ((time > 16 && minutes >= 30 ) || time >= 17) {
    //o mercado inicia o encerramento às 16:50
    console.log(time);
    return dateTime.substring(0,11)+"16:45";
  }
  return dateTime;
}

function round(date, duration, method) {
    return moment(Math[method]((+date) / (+duration)) * (+duration));
}

module.exports = DateHelper;
