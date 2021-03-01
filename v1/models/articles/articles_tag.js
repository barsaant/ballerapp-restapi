module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "articles_tag",
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
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "tagArticle",
          key: "tagId",
        },
      },
    },
    {
      sequelize,
      tableName: "articles_tag",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "articleId" }, { name: "tagId" }],
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
