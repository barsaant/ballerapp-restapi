const bcrypt = require("bcrypt");
const ErrorMsg = require("../../utils/ErrorMsg");

module.exports = function (sequelize, DataTypes) {
  const user = sequelize.define(
    "user",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: "email",
      },
      role: {
        type: DataTypes.ENUM(
          "user",
          "operator",
          "publisher",
          "admin",
          "superadmin"
        ),
        allowNull: false,
        defaultValue: "user",
      },
      phoneIntCode: {
        type: DataTypes.STRING(),
        allowNull: true,
      },
      birthDay: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING("8"),
        allowNull: true,
        unique: true,
      },
      emailVerified: {
        type: DataTypes.ENUM("true", "false"),
        allowNull: false,
        defaultValue: "false",
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
      tableName: "user",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "userId" }],
        },
        {
          name: "email",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
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

  user.checkPassword = async function (email, password) {
    const User = await user.findOne({ where: { email: email } });

    if (!User) {
      throw new ErrorMsg("Таны Email эсвэл нууц үг буруу байна", 401);
    }

    return await bcrypt.compare(password, User.password);
  };

  return user;
};
