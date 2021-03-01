module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "tagArticle",
    {
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      tagName: {
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
      tableName: "tagArticle",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "tagId" }],
        },
        {
          name: "tagName",
          unique: true,
          fields: [{ name: "tagName" }],
        },
      ],
    }
  );
};
