
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
    },
    stocknotes: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
  return Stock;
};