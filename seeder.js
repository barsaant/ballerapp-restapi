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

const importData = async () => {
  try {
    // District
    for (var i = 0; i < district.length; i++) {
      await db.district.create(district[i]);
    }

    // Khoroo
    for (var i = 0; i < khoroo.length; i++) {
      await db.khoroo.create(khoroo[i]);
    }
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
