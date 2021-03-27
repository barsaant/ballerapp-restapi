module.exports = function (sequelize, DataTypes) {
  const userVerify = sequelize.define(
    "userVerify",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      emailVerified: {
        type: DataTypes.ENUM("true", "false"),
        allowNull: false,
        defaultValue: "false",
      },
      emailChangeVerified: {
        type: DataTypes.ENUM("true", "false"),
        allowNull: false,
        defaultValue: "false",
      },
      emailChangeVerifiedExpire: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      emailChangeVerificationCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      emailChangeVerificationExpire: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      emailVerificationCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      emailVerificationCodeExpire: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      phoneChangeVerificationCode: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      phoneChangeVerificationExpire: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      phoneVerificationCode: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      phoneVerificationCodeExpire: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      resetPasswordCodeEmail: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      resetPasswordCodeEmailExpire: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      resetPasswordCodePhone: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      resetPasswordCodePhoneExpire: {
        type: DataTypes.DATE,
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
      tableName: "userVerify",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "userId" }],
        },
      ],
    }
  );

  // user.beforeCreate(async function (User) {
  //   const salt = await bcrypt.genSalt(10);
  //   User.password = await bcrypt.hash(User.password, salt);
  // });

  // user.updatePassword = async function (password) {
  //   if (password) {
  //     user.beforeUpdate(async function (User) {
  //       const salt = await bcrypt.genSalt(10);
  //       User.password = await bcrypt.hash(password, salt);
  //     });
  //   }
  // };

  return userVerify;
};
