const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const injectDb = require("./v1/middleware/injectDb");
const db = require("./config/db-mysql");
const fileupload = require("express-fileupload");

const errorHandler = require("./v1/middleware/error");
const cors = require("cors");

const userRoute = require("./v1/routes/global/users");
const mediaRoute = require("./v1/routes/global/mediaLibrary");
const districtRoute = require("./v1/routes/halls/districts");
const khorooRoute = require("./v1/routes/halls/khoroos");
const sportHallRoute = require("./v1/routes/halls/sportHalls");
const tagRoute = require("./v1/routes/halls/tagSportHalls");

const server = express();

server.use(injectDb(db));
server.use(express.json());
server.use(fileupload());
server.use(cors());

// Server Route
server.use(`${process.env.ROUTE}/medias/`, mediaRoute);
server.use(`${process.env.ROUTE}/users/`, userRoute);
server.use(`${process.env.ROUTE}/districts/`, districtRoute);
server.use(`${process.env.ROUTE}/khoroos/`, khorooRoute);
server.use(`${process.env.ROUTE}/sporthalls/`, sportHallRoute);
server.use(`${process.env.ROUTE}/tagshalls/`, tagRoute);

server.use(errorHandler);

db.sportHall.belongsToMany(db.mediaLibrary, {
  through: db.mediaLibrary_sportHalls,
  foreignKey: "hallId",
  otherKey: "mediaId",
});

db.mediaLibrary.belongsToMany(db.sportHall, {
  through: db.mediaLibrary_sportHalls,
  foreignKey: "mediaId",
  otherKey: "hallId",
});

db.sportHall.belongsToMany(db.tagSportHall, {
  through: db.sportHalls_tag,
  foreignKey: "hallId",
  otherKey: "tagId",
});

db.tagSportHall.belongsToMany(db.sportHall, {
  through: db.sportHalls_tag,
  foreignKey: "tagId",
  otherKey: "hallId",
});

db.user.belongsToMany(db.sportHall, {
  through: db.favoriteSportHall,
  foreignKey: "userId",
  otherKey: "hallId",
});

db.sportHall.belongsToMany(db.user, {
  through: db.favoriteSportHall,
  foreignKey: "hallId",
  otherKey: "userId",
});

db.sportHall.belongsTo(db.district, {
  foreignKey: "districtId",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.district.hasMany(db.sportHall, {
  foreignKey: "districtId",
});
db.sportHall.belongsTo(db.khoroo, {
  foreignKey: "khorooId",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.khoroo.hasMany(db.sportHall, {
  foreignKey: "khorooId",
});
db.khoroo.belongsTo(db.district, {
  foreignKey: "districtId",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.district.hasMany(db.khoroo, {
  foreignKey: "districtId",
});

db.sequelize
  .sync()
  .then((result) => {
    console.log("");
  })
  .catch((err) => console.log(err));

server.use("/", express.static("_public"));

server.listen(process.env.PORT, console.log(`Port: ${process.env.PORT}`));
