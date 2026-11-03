const express = require("express");

const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
} = require("../controllers/opportunity-controller");

const {
  protect,
  adminOnly
} = require("../middleware/auth-middleware");

const router = express.Router();

router.get("/", getOpportunities);
router.get("/:id", getOpportunityById);

router.post("/", protect, adminOnly, createOpportunity);
router.put("/:id", protect, adminOnly, updateOpportunity);
router.delete("/:id", protect, adminOnly, deleteOpportunity);

module.exports = router;