'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      paranoid: true,
      underscore: true,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      paranoid: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });
  return User;
};
