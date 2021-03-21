module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "orderedScheduleSportHall",
    {
      hallId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "sportHall",
          key: "hallId",
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
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
      tableName: "orderedScheduleSportHall",
      timestamps: true,
      indexes: [
        {
          name: "hallId",
          using: "BTREE",
          fields: [{ name: "hallId" }],
        },
      ],
    }
  );
};
