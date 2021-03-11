const express = require("express");
const { protect, authorize } = require("../../middleware/protect");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../../controller/articles/categoryArticle/categoryArticles");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(protect, authorize("admin", "superadmin"), createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin", "superadmin"), updateCategory)
  .delete(protect, authorize("admin", "superadmin"), deleteCategory);

module.exports = router;
