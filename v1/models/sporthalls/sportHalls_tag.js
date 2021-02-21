module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "sportHalls_tag",
    {
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
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
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "tagSportHall",
          key: "tagId",
        },
      },
    },
    {
      sequelize,
      tableName: "sportHalls_tag",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "hallId" }, { name: "tagId" }],
        },
        {
          name: "tagId",
          using: "BTREE",
          fields: [{ name: "tagId" }],
        },
      ],
    }
  );
};
