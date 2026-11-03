const express = require("express");

const {
  getFavorites,
  addFavorite,
  removeFavorite
} = require("../controllers/favorites-controller");

const { protect } = require("../middleware/auth-middleware");

const router = express.Router();

router.get("/", protect, getFavorites);
router.post("/:opportunityId", protect, addFavorite);
router.delete("/:opportunityId", protect, removeFavorite);

module.exports = router;