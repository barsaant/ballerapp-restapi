module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "mediaLibrary",
    {
      mediaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      mediaPath: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      mediaType: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      mediaCategory: {
        type: DataTypes.ENUM("sporthalls", "articles", "global"),
        allownull: false,
        defaultValue: "global",
      },
      base: {
        type: DataTypes.STRING(30),
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
      tablename: "mediaLibrary",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "mediaId" }],
        },
        {
          name: "mediaPath",
          unique: true,
          using: "BTREE",
          fields: [{ name: "mediaPath" }],
        },
      ],
    }
  );
};
