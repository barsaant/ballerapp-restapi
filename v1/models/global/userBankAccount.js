module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "userBankAccount",
    {
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "userId",
        },
      },
      bankName: {
        type: DataTypes.ENUM("Khanbank", "Golomt", "TDB", "Khasbank"),
        allowNull: true,
      },
      bankAccount: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      accountName: {
        type: DataTypes.STRING(25),
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
      tableName: "userBankAccount",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "userId" }],
        },
        {
          name: "userId",
          using: "BTREE",
          fields: [{ name: "userId" }],
        },
      ],
    }
  );
};
