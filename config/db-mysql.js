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

    operatorAliases: false,
  }
);
const models = [
  require("../v1/models/global/user"),
  require("../v1/models/global/mediaLibrary"),
  require("../v1/models/sporthalls/district"),
  require("../v1/models/sporthalls/khoroo"),
  require("../v1/models/sporthalls/sportHall"),
  require("../v1/models/sporthalls/tagSportHall"),
  require("../v1/models/sporthalls/sportHalls_tag"),
  require("../v1/models/sporthalls/favoriteSportHall"),
  require("../v1/models/sporthalls/rateSportHall"),
  require("../v1/models/sporthalls/mediaLibrary_sportHalls"),
];

models.forEach((model) => {
  const seqModel = model(sequelize, Sequelize);
  db[seqModel.name] = seqModel;
});

db.sequelize = sequelize;
module.exports = db;
