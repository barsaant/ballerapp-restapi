module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "orderOpSportHall",
    {
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "user",
          key: "userId",
        },
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "orderSportHall",
          key: "orderId",
        },
      },
    },
    {
      sequelize,
      tableName: "orderOpSportHall",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "userId" }, { name: "orderId" }],
        },
        {
          name: "orderId",
          using: "BTREE",
          fields: [{ name: "orderId" }],
        },
      ],
    }
  );
};
