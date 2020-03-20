const alpha = require('alphavantage')({ key: '4MH53GP5D4RCM8NJ' });

module.exports = function(sequelize, DataTypes) {
  var Stock = sequelize.define("Stock", {
    stockname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  Stock.prototype.search = function (stockname) {
    alpha.data.intraday(`${stockname}`).then(data => {
      console.log(data);
    });
  }
  return Stock;
};