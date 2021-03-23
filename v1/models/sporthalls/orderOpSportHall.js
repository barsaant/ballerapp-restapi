module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "orderOpSportHall",
    {
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
      hallId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "orderSportHall",
          key: "hallId",
        },
      },
      status: {
        type: DataTypes.ENUM("confirmed", "unconfirmed"),
        allowNull: true,
        defaultValue: "unconfirmed",
      },
      paid: {
        type: DataTypes.ENUM("paid", "pending", "unpaid"),
        allowNull: true,
        defaultValue: "unpaid",
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      confirmedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
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
          fields: [{ name: "userId" }, { name: "orderId" }, { name: "hallId" }],
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
