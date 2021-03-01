module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "article",
    {
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: false,
      },
      thumbnail: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: "no-image.jpg",
      },
      article: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("posted", "saved", "deleted"),
        allowNull: false,
        defaultValue: "saved",
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
      tablename: "article",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "articleId" }],
        },
      ],
    }
  );
};
