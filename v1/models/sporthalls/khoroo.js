module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "khoroo",
    {
      khorooId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      khorooName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      districtId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "district",
          key: "districtId",
        },
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
      tablename: "khoroo",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "khorooId" }],
        },
        {
          name: "districtId",
          using: "BTREE",
          fields: [{ name: "districtId" }],
        },
      ],
    }
  );
};
