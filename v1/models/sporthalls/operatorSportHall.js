module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "operatorSportHall",
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
    },
    {
      sequelize,
      tableName: "operatorSportHall",
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
