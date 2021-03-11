const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const injectDb = require("./v1/middleware/injectDb");
const db = require("./config/db-mysql");
const fileupload = require("express-fileupload");

const errorHandler = require("./v1/middleware/error");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoute = require("./v1/routes/global/users");
const mediaRoute = require("./v1/routes/global/mediaLibrary");
const districtRoute = require("./v1/routes/halls/districts");
const khorooRoute = require("./v1/routes/halls/khoroos");
const sportHallRoute = require("./v1/routes/halls/sportHalls");
const tagRoute = require("./v1/routes/halls/tagSportHalls");
const favoriteHallRoute = require("./v1/routes/halls/favoriteSportHalls");
const rateSportHallRoute = require("./v1/routes/halls/rateSportHalls");
const articleRoute = require("./v1/routes/articles/articles");
const categoryArticleRoute = require("./v1/routes/articles/categoryArticles");
const tagArticleRoute = require("./v1/routes/articles/tagArticles");
const favoriteArticleRoute = require("./v1/routes/articles/favoriteArticles");

const server = express();

var whitelist = [
  "https://www.baller.mn",
  "https://baller.mn",
  "https://dashboard.baller.mn",
  "http://localhost:3000",
  "http://localhost:5000",
];

var corsOptions = {
  origin: function (origin, callback) {
    // console.log(origin);
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Access Denied.."));
    }
  },
  allowedHeaders: "Authorization, Set-Cookie, Content-Type",
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
};
server.set("trust proxy", 1);
server.use(injectDb(db));
server.use(cookieParser());
server.use(express.json());
server.use(fileupload());
server.use(cors(corsOptions));

// Server Route
server.use(`${process.env.ROUTE}/medias/`, mediaRoute);
server.use(`${process.env.ROUTE}/users/`, userRoute);
server.use(`${process.env.ROUTE}/districts/`, districtRoute);
server.use(`${process.env.ROUTE}/khoroos/`, khorooRoute);
server.use(`${process.env.ROUTE}/sporthalls/`, sportHallRoute);
server.use(`${process.env.ROUTE}/ratesporthall/`, rateSportHallRoute);
server.use(`${process.env.ROUTE}/tagshalls/`, tagRoute);
server.use(`${process.env.ROUTE}/favoritehalls/`, favoriteHallRoute);
server.use(`${process.env.ROUTE}/articles/`, articleRoute);
server.use(`${process.env.ROUTE}/categories/`, categoryArticleRoute);
server.use(`${process.env.ROUTE}/tagarticles/`, tagArticleRoute);
server.use(`${process.env.ROUTE}/favoritearticles/`, favoriteArticleRoute);

server.use(errorHandler);

db.user.belongsToMany(db.sportHall, {
  through: db.rateSportHall,
  foreignKey: "userId",
  otherKey: "hallId",
});

db.sportHall.belongsToMany(db.user, {
  through: db.rateSportHall,
  foreignKey: "hallId",
  otherKey: "userId",
});

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

db.user.belongsToMany(db.article, {
  through: db.favoriteArticle,
  foreignKey: "userId",
  otherKey: "articleId",
});

db.article.belongsToMany(db.user, {
  through: db.favoriteArticle,
  foreignKey: "articleId",
  otherKey: "userId",
});

db.article.belongsToMany(db.tagArticle, {
  through: db.articles_tag,
  foreignKey: "articleId",
  otherKey: "tagId",
});

db.tagArticle.belongsToMany(db.article, {
  through: db.articles_tag,
  foreignKey: "tagId",
  otherKey: "articleId",
});

db.article.belongsToMany(db.categoryArticle, {
  through: db.articles_category,
  foreignKey: "articleId",
  otherKey: "categoryId",
});

db.categoryArticle.belongsToMany(db.article, {
  through: db.articles_category,
  foreignKey: "categoryId",
  otherKey: "articleId",
});

db.article.belongsToMany(db.mediaLibrary, {
  through: db.mediaLibrary_articles,
  foreignKey: "articleId",
  otherKey: "mediaId",
});

db.mediaLibrary.belongsToMany(db.article, {
  through: db.mediaLibrary_articles,
  foreignKey: "mediaId",
  otherKey: "articleId",
});

db.sequelize
  .sync()
  .then((result) => {
    console.log("");
  })
  .catch((err) => console.log(err));

server.use("/", express.static("public"));

server.listen(process.env.PORT, console.log(`Port: ${process.env.PORT}`));
