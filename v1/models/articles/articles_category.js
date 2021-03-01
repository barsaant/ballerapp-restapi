module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "articles_category",
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
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "categoryArticle",
          key: "categoryId",
        },
      },
    },
    {
      sequelize,
      tableName: "articles_category",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "articleId" }, { name: "categoryId" }],
        },
        {
          name: "categoryId",
          using: "BTREE",
          fields: [{ name: "categoryId" }],
        },
      ],
    }
  );
};
