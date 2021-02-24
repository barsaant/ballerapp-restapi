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

    const districts = await db.district.findAll({ raw: true });
    const khoroos = await db.khoroo.findAll({ raw: true });
    const sportHalls = await db.sportHall.findAll({ raw: true });
    const tagSportHalls = await db.tagSportHall.findAll({ raw: true });

    const writeFileAsync = (districts, khoroos, sportHalls) => {
      const stringifiDistrict = JSON.stringify(districts);
      const stringifiKhoroo = JSON.stringify(khoroos);
      const stringifiSportHall = JSON.stringify(sportHalls);

      fs.writeFile(dir + "/district.json", stringifiDistrict, (error) => {
        if (error) {
          console.log("Амжилтгүй боллоо");
          console.log(error);
        } else {
          console.log("Амжилттай татаж авлаа");
          console.log(stringifiDistrict);
        }
      });
      fs.writeFile(dir + "/khoroo.json", stringifiKhoroo, (error) => {
        if (error) {
          console.log("Амжилтгүй боллоо");
          console.log(error);
        } else {
          console.log("Амжилттай татаж авлаа");
          console.log(stringifiDistrict);
        }
      });

      fs.writeFile(dir + "/sportHall.json", stringifiSportHall, (error) => {
        if (error) {
          console.log("Амжилтгүй боллоо");
          console.log(error);
        } else {
          console.log("Амжилттай татаж авлаа");
          console.log(stringifiDistrict);
        }
      });
    };
    writeFileAsync(districts, khoroos, sportHalls);
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] == "-i") {
  downloadData();
}
