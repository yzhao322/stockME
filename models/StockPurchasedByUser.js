module.exports = function(sequelize, DataTypes) {
  let StockPurchasedByUser = sequelize.define("StockPurchasedByUser", {
    username: {
      type: DataTypes.STRING,
    },
    purchaseStockName: {
      type: DataTypes.STRING,
    },
    purchasePrice: {
      type: DataTypes.FLOAT,
    },
    purchaseShares: {
      type: DataTypes.INTEGER,
    }
  });
  return StockPurchasedByUser;
};
