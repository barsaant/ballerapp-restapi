module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "favoriteArticle",
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
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "article",
          key: "articleId",
        },
      },
    },
    {
      sequelize,
      tableName: "favoriteArticle",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "userId" }, { name: "articleId" }],
        },
        {
          name: "articleId",
          using: "BTREE",
          fields: [{ name: "articleId" }],
        },
      ],
    }
  );
};
