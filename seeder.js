const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const db = require("./config/db-mysql");

// district
const district = JSON.parse(
  fs.readFileSync(__dirname + "/data/district.json", "utf-8")
);

// khoroo
const khoroo = JSON.parse(
  fs.readFileSync(__dirname + "/data/khoroo.json", "utf-8")
);

// tagSportHall

const tagSportHall = JSON.parse(
  fs.readFileSync(__dirname + "/data/tagSportHall.json", "utf-8")
);

// sportHalls_tag
const sportHalls_tag = JSON.parse(
  fs.readFileSync(__dirname + "/data/sportHall.json", "utf-8")
);

// sportHall
const sportHall = JSON.parse(
  fs.readFileSync(__dirname + "/data/sportHalls_tag.json", "utf-8")
);

// rateSportHall

const rateSportHall = JSON.parse(
  fs.readFileSync(__dirname + "/data/rateSportHall.json", "utf-8")
);

// favoriteSportHall

const favoriteSportHall = JSON.parse(
  fs.readFileSync(__dirname + "/data/favoriteSportHall.json", "utf-8")
);

// categoryArticle

const categoryArticle = JSON.parse(
  fs.readFileSync(__dirname + "/data/categoryArticle.json", "utf-8")
);

// tagArticle

const tagArticle = JSON.parse(
  fs.readFileSync(__dirname + "/data/tagArticle.json", "utf-8")
);

// Article

const article = JSON.parse(
  fs.readFileSync(__dirname + "/data/article.json", "utf-8")
);

// articles_category

const articles_category = JSON.parse(
  fs.readFileSync(__dirname + "/data/articles_category.json", "utf-8")
);

// articles_tag

const articles_tag = JSON.parse(
  fs.readFileSync(__dirname + "/data/articles_tag.json", "utf-8")
);

// favoriteArticle

const favoriteArticle = JSON.parse(
  fs.readFileSync(__dirname + "/data/favoriteArticle.json", "utf-8")
);

// user

const user = JSON.parse(
  fs.readFileSync(__dirname + "/data/user.json", "utf-8")
);

// mediaLibrary

const mediaLibrary = JSON.parse(
  fs.readFileSync(__dirname + "/data/mediaLibrary.json", "utf-8")
);

// mediaLibrary_sportHalls

const mediaLibrary_sportHalls = JSON.parse(
  fs.readFileSync(__dirname + "/data/mediaLibrary_sportHalls.json", "utf-8")
);

// mediaLibrary_articles

const mediaLibrary_articles = JSON.parse(
  fs.readFileSync(__dirname + "/data/mediaLibrary_articles.json", "utf-8")
);

const importData = async () => {
  try {
    // User
    for (var i = 0; i < user.length; i++) {
      await db.user.create(user[i]);
    }

    for (var i = 0; i < user.length; i++) {
      await db.userVerify.create(user[i]);
    }
    // District
    for (var i = 0; i < district.length; i++) {
      await db.district.create(district[i]);
    }

    // Khoroo
    for (var i = 0; i < khoroo.length; i++) {
      await db.khoroo.create(khoroo[i]);
    }

    // tagSportHall
    for (var i = 0; i < tagSportHall.length; i++) {
      await db.tagSportHall.create(tagSportHall[i]);
    }

    // SportHalls
    for (var i = 0; i < sportHall.length; i++) {
      await db.sportHall.create(sportHall[i]);
    }

    // sportHalls_tag

    // for (var i = 0; i < sportHalls_tag.length; i++) {
    //   await db.sportHalls_tag.create(sportHalls_tag[i]);
    // }

    // // rateSportHall

    // for (var i = 0; i < rateSportHall.length; i++) {
    //   await db.rateSportHall.create(rateSportHall[i]);
    // }

    // // favoriteSportHall

    // for (var i = 0; i < favoriteSportHall.length; i++) {
    //   await db.favoriteSportHall.create(favoriteSportHall[i]);
    // }

    // CategoryArticle
    for (var i = 0; i < categoryArticle.length; i++) {
      await db.categoryArticle.create(categoryArticle[i]);
    }

    // TagArticle

    for (var i = 0; i < tagArticle.length; i++) {
      await db.tagArticle.create(tagArticle[i]);
    }

    // Article

    for (var i = 0; i < article.length; i++) {
      await db.article.create(article[i]);
    }

    // articles_category

    for (var i = 0; i < articles_category.length; i++) {
      await db.articles_category.create(articles_category[i]);
    }

    // // articles_tag

    // for (var i = 0; i < articles_tag.length; i++) {
    //   await db.articles_tag.create(articles_tag[i]);
    // }

    // // favoriteArticle

    // for (var i = 0; i < favoriteArticle.length; i++) {
    //   await db.favoriteArticle.create(favoriteArticle[i]);
    // }

    // MediaLibrary

    for (var i = 0; i < mediaLibrary.length; i++) {
      await db.mediaLibrary.create(mediaLibrary[i]);
    }

    // // mediaLibrary_sportHalls

    // for (var i = 0; i < mediaLibrary_sportHalls.length; i++) {
    //   await db.mediaLibrary_sportHalls.create(mediaLibrary_sportHalls[i]);
    // }

    // // mediaLibrary_articles

    // for (var i = 0; i < mediaLibrary_articles.length; i++) {
    //   await db.mediaLibrary_articles.create(mediaLibrary_articles[i]);
    // }

    console.log("Дата-г хуулж дуусгалаа.");
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    // Khoroo
    const khorooAllData = await db.khoroo.findAll();
    for (var i = 0; i < khorooAllData.length; i++) {
      const khorooDataId = khorooAllData[i].khorooId;
      let khorooData = await db.khoroo.findByPk(khorooDataId);
      await khorooData.destroy();
    }

    // District
    const districtAllData = await db.district.findAll();
    for (var i = 0; i < districtAllData.length; i++) {
      const districtDataId = districtAllData[i].districtId;
      let districtData = await db.district.findByPk(districtDataId);
      await districtData.destroy();
    }

    console.log("Data-г устгаж дууслаа...");
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
