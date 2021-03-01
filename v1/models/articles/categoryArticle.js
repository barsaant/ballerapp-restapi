module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "categoryArticle",
    {
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      categoryName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
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
      tableName: "categoryArticle",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "categoryId" }],
        },
        {
          name: "tagName",
          unique: true,
          fields: [{ name: "categoryName" }],
        },
      ],
    }
  );
};
