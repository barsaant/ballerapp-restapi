const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const db = require("./config/db-mysql");

const downloadData = async () => {
  try {
    const dir = __dirname + "/data";

    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, function (err) {
        if (err) {
          return console.error(err);
        }
        console.log("Хавтас амжилттай үүслээ!");
      });
    }

    const users = await db.user.findAll({ raw: true });
    const districts = await db.district.findAll({ raw: true });
    const khoroos = await db.khoroo.findAll({ raw: true });
    const sportHalls = await db.sportHall.findAll({ raw: true });
    const tagSportHalls = await db.tagSportHall.findAll({ raw: true });
    const sportHalls_Tag = await db.sportHalls_tag.findAll({ raw: true });
    const rateSportHall = await db.rateSportHall.findAll({ raw: true });
    const favoriteSportHall = await db.favoriteSportHall.findAll({ raw: true });
    const mediaLibrary_sportHalls = await db.mediaLibrary_sportHalls.findAll({
      raw: true,
    });
    const categoryArticle = await db.categoryArticle.findAll({ raw: true });
    const tagArticle = await db.tagArticle.findAll({ raw: true });
    const article = await db.article.findAll({ raw: true });
    const articles_category = await db.articles_category.findAll({ raw: true });
    const articles_tag = await db.articles_tag.findAll({ raw: true });
    const favoriteArticle = await db.favoriteArticle.findAll({ raw: true });
    const mediaLibrary_articles = await db.mediaLibrary_articles.findAll({
      raw: true,
    });
    const mediaLibrary = await db.mediaLibrary.findAll({ raw: true });

    const writeFileAsync = (
      users,
      districts,
      khoroos,
      sportHalls,
      tagSportHalls,
      sportHalls_Tag,
      rateSportHall,
      favoriteSportHall,
      mediaLibrary_sportHalls,
      categoryArticle,
      tagArticle,
      article,
      articles_category,
      articles_tag,
      favoriteArticle,
      mediaLibrary_articles,
      mediaLibrary
    ) => {
      const stringifyUser = JSON.stringify(users);
      const stringifyDistrict = JSON.stringify(districts);
      const stringifyKhoroo = JSON.stringify(khoroos);
      const stringifyTagSportHalls = JSON.stringify(tagSportHalls);
      const stringifySportHall = JSON.stringify(sportHalls);
      const stringifySportHallsTag = JSON.stringify(sportHalls_Tag);
      const stringifyRateSportHall = JSON.stringify(rateSportHall);
      const stringifyFavoriteSportHall = JSON.stringify(favoriteSportHall);
      const stringifyMediaLibrary_sportHalls = JSON.stringify(
        mediaLibrary_sportHalls
      );
      const stringifyCategoryArticle = JSON.stringify(categoryArticle);
      const stringifyTagArticle = JSON.stringify(tagArticle);
      const stringifyArticle = JSON.stringify(article);
      const stringify_Articles_Category = JSON.stringify(articles_category);
      const stringify_Articles_Tag = JSON.stringify(articles_tag);
      const stringifyFavoriteArticle = JSON.stringify(favoriteArticle);
      const stringify_MediaLibrary_articles = JSON.stringify(
        mediaLibrary_articles
      );
      const stringifyMediaLibrary = JSON.stringify(mediaLibrary);
      fs.writeFile(dir + "/user.json", stringifyUser, (error) => {
        if (error) {
          console.log("Амжилтгүй боллоо");
          console.log(error);
        } else {
          console.log("Амжилттай татаж авлаа");
          console.log(stringifyDistrict);
        }
      });

      fs.writeFile(dir + "/district.json", stringifyDistrict, (error) => {
        if (error) {
          console.log("Амжилтгүй боллоо");
          console.log(error);
        } else {
          console.log("Амжилттай татаж авлаа");
          console.log(stringifyDistrict);
        }
      });

      fs.writeFile(dir + "/khoroo.json", stringifyKhoroo, (error) => {
        if (error) {
          console.log("Амжилтгүй боллоо");
          console.log(error);
        } else {
          console.log("Амжилттай татаж авлаа");
          console.log(stringifyKhoroo);
        }
      });

      fs.writeFile(
        dir + "/tagSportHall.json",
        stringifyTagSportHalls,
        (error) => {
          if (error) {
            console.log("Амжилтгүй боллоо");
            console.log(error);
          } else {
            console.log("Амжилттай татаж авлаа");
            console.log(stringifyTagSportHalls);
          }
        }
      );

      fs.writeFile(dir + "/sportHall.json", stringifySportHall, (error) => {
        if (error) {
          console.log("Амжилтгүй боллоо");
          console.log(error);
        } else {
          console.log("Амжилттай татаж авлаа");
          console.log(stringifySportHall);
        }
      });

      fs.writeFile(
        dir + "/sportHalls_tag.json",
        stringifySportHallsTag,
        (error) => {
          if (error) {
            console.log("Амжилтгүй боллоо");
            console.log(error);
          } else {
            console.log("Амжилттай татаж авлаа");
            console.log(stringifySportHallsTag);
          }
        }
      );

      fs.writeFile(
        dir + "/rateSportHall.json",
        stringifyRateSportHall,
        (error) => {
          if (error) {
            console.log("Амжилтгүй боллоо");
            console.log(error);
          } else {
            console.log("Амжилттай татаж авлаа");
            console.log(stringifyRateSportHall);
          }
        }
      );

      fs.writeFile(
        dir + "/favoriteSportHall.json",
        stringifyFavoriteSportHall,
        (error) => {
          if (error) {
            console.log("Амжилтгүй боллоо");
            console.log(error);
          } else {
            console.log("Амжилттай татаж авлаа");
            console.log(stringifyFavoriteSportHall);
          }
        }
      );

      fs.writeFile(
        dir + "/mediaLibrary_sportHalls.json",
        stringifyMediaLibrary_sportHalls,
        (error) => {
          if (error) {
            console.log("Амжилтгүй боллоо");
            console.log(error);
          } else {
            console.log("Амжилттай татаж авлаа");
            console.log(stringifyMediaLibrary_sportHalls);
          }
        }
      );

      fs.writeFile(
        dir + "/categoryArticle.json",
        stringifyCategoryArticle,
        (error) => {
          if (error) {
            console.log("Амжилтгүй боллоо");
            console.log(error);
          } else {
            console.log("Амжилттай татаж авлаа");
            console.log(stringifyCategoryArticle);
          }
        }
      );

      fs.writeFile(dir + "/tagArticle.json", stringifyTagArticle, (error) => {
        if (error) {
          console.log("Амжилтгүй боллоо");
          console.log(error);
        } else {
          console.log("Амжилттай татаж авлаа");
          console.log(stringifyTagArticle);
        }
      });

      fs.writeFile(dir + "/article.json", stringifyArticle, (error) => {
        if (error) {
          console.log("Амжилтгүй боллоо");
          console.log(error);
        } else {
          console.log("Амжилттай татаж авлаа");
          console.log(stringifyArticle);
        }
      });

      fs.writeFile(
        dir + "/articles_category.json",
        stringify_Articles_Category,
        (error) => {
          if (error) {
            console.log("Амжилтгүй боллоо");
            console.log(error);
          } else {
            console.log("Амжилттай татаж авлаа");
            console.log(stringify_Articles_Category);
          }
        }
      );

      fs.writeFile(
        dir + "/articles_tag.json",
        stringify_Articles_Tag,
        (error) => {
          if (error) {
            console.log("Амжилтгүй боллоо");
            console.log(error);
          } else {
            console.log("Амжилттай татаж авлаа");
            console.log(stringify_Articles_Tag);
          }
        }
      );

      fs.writeFile(
        dir + "/favoriteArticle.json",
        stringifyFavoriteArticle,
        (error) => {
          if (error) {
            console.log("Амжилтгүй боллоо");
            console.log(error);
          } else {
            console.log("Амжилттай татаж авлаа");
            console.log(stringifyFavoriteArticle);
          }
        }
      );

      fs.writeFile(
        dir + "/mediaLibrary_articles.json",
        stringify_MediaLibrary_articles,
        (error) => {
          if (error) {
            console.log("Амжилтгүй боллоо");
            console.log(error);
          } else {
            console.log("Амжилттай татаж авлаа");
            console.log(stringify_MediaLibrary_articles);
          }
        }
      );

      fs.writeFile(
        dir + "/mediaLibrary.json",
        stringifyMediaLibrary,
        (error) => {
          if (error) {
            console.log("Амжилтгүй боллоо");
            console.log(error);
          } else {
            console.log("Амжилттай татаж авлаа");
            console.log(stringifyMediaLibrary);
          }
        }
      );
    };
    writeFileAsync(
      users,
      districts,
      khoroos,
      sportHalls,
      tagSportHalls,
      sportHalls_Tag,
      rateSportHall,
      favoriteSportHall,
      mediaLibrary_sportHalls,
      categoryArticle,
      tagArticle,
      article,
      articles_category,
      articles_tag,
      favoriteArticle,
      mediaLibrary_articles,
      mediaLibrary
    );
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] == "-i") {
  downloadData();
}
