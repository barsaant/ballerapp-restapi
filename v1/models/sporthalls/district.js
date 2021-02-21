module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "district",
    {
      districtId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      districtName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: "districtName",
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
      tableName: "district",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "districtId" }],
        },
        {
          name: "district",
          unique: true,
          using: "BTREE",
          fields: [{ name: "districtName" }],
        },
      ],
    }
  );
};
