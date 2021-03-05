module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "mediaLibrary_articles",
    {
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "article",
          key: "articleId",
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
      tableName: "mediaLibrary_articles",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "articleId" }, { name: "mediaId" }],
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
