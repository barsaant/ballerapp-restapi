const Sequelize = require("sequelize");

var db = {};

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: process.env.MYSQL_DIALECT,
    define: {
      freezeTableName: true,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      // typeCast: function (field, next) {
      //   if (field.type === "DATETIME") {
      //     return field.string();
      //   }
      //   return next();
      // },
    },
    timezone: "+08:00",
    operatorAliases: false,
  }
);
const models = [
  require("../v1/models/global/user"),
  require("../v1/models/global/userBankAccount"),
  require("../v1/models/global/mediaLibrary"),
  require("../v1/models/sporthalls/district"),
  require("../v1/models/sporthalls/khoroo"),
  require("../v1/models/sporthalls/sportHall"),
  require("../v1/models/sporthalls/tagSportHall"),
  require("../v1/models/sporthalls/sportHalls_tag"),
  require("../v1/models/sporthalls/favoriteSportHall"),
  require("../v1/models/sporthalls/rateSportHall"),
  require("../v1/models/sporthalls/operatorSportHall"),
  require("../v1/models/sporthalls/scheduleSportHall"),
  require("../v1/models/sporthalls/orderSportHall"),
  require("../v1/models/sporthalls/orderedScheduleSportHall"),
  require("../v1/models/sporthalls/orderOpSportHall"),
  require("../v1/models/sporthalls/mediaLibrary_sportHalls"),
  require("../v1/models/articles/article"),
  require("../v1/models/articles/categoryArticle"),
  require("../v1/models/articles/tagArticle"),
  require("../v1/models/articles/articles_tag"),
  require("../v1/models/articles/articles_category"),
  require("../v1/models/articles/favoriteArticle"),
  require("../v1/models/articles/mediaLibrary_articles"),
];

models.forEach((model) => {
  const seqModel = model(sequelize, Sequelize);
  db[seqModel.name] = seqModel;
});

db.sequelize = sequelize;
module.exports = db;
