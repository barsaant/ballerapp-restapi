module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "payRequestSportHall",
    {
      reqId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("paid", "pending"),
        defaultValue: "pending",
      },
      paidAt: {
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
      tableName: "payRequestSportHall",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "orderId" }, { name: "userId" }, { name: "hallId" }],
        },
        {
          name: "hallId",
          using: "BTREE",
          fields: [{ name: "hallId" }],
        },
      ],
    }
  );
};
