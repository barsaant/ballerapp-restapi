module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "sportHall",
    {
      hallId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: false,
        defaultValue: "(Нэргүй)",
      },
      thumbnail: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: "no-image.jpg",
      },
      images: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      info: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      phone: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      districtId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "district",
          key: "districtId",
        },
        defaultValue: 1,
      },
      khorooId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "khoroo",
          key: "khorooId",
        },
        defaultValue: 1,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("posted", "saved", "deleted"),
        allowNull: false,
        defaultValue: "saved",
      },
      rating: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
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
      tablename: "sportHall",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "hallId" }],
        },
        {
          name: "districtId",
          using: "BTREE",
          fields: [{ name: "districtId" }],
        },
        {
          name: "khorooId",
          using: "BTREE",
          fields: [{ name: "khorooId" }],
        },
      ],
    }
  );
};
