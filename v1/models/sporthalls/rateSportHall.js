module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "rateSportHall",
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
      hallId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "sportHall",
          key: "hallId",
        },
      },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "rateSportHall",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "userId" }, { name: "hallId" }],
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
