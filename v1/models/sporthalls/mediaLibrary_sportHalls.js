module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "mediaLibrary_sportHalls",
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
      mediaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "mediaLibrary",
          key: "mediaId",
        },
      },
    },
    {
      sequelize,
      tableName: "mediaLibrary_sportHalls",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "hallId" }, { name: "mediaId" }],
        },
        {
          name: "mediaId",
          using: "BTREE",
          fields: [{ name: "mediaId" }],
        },
      ],
    }
  );
};
