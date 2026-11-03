const Favorite = require("../models/favorites");
const Opportunity = require("../models/opportunity");

// Get the logged-in student's favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.user._id
    }).populate("opportunity");

    return res.status(200).json({
      favorites: favorites
        .filter((favorite) => favorite.opportunity)
        .map((favorite) => favorite.opportunity)
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch favorites"
    });
  }
};

// Add a favorite
const addFavorite = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found"
      });
    }

    const existing = await Favorite.findOne({
      user: req.user._id,
      opportunity: opportunityId
    });

    if (existing) {
      return res.status(409).json({
        message: "Already saved to favorites"
      });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      opportunity: opportunityId
    });

    return res.status(201).json({
      message: "Added to favorites",
      favorite
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Already saved to favorites"
      });
    }

    return res.status(400).json({
      message: "Unable to add favorite"
    });
  }
};

// Remove a favorite
const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      opportunity: req.params.opportunityId
    });

    if (!favorite) {
      return res.status(404).json({
        message: "Favorite not found"
      });
    }

    return res.status(200).json({
      message: "Removed from favorites"
    });
  } catch (error) {
    return res.status(400).json({
      message: "Unable to remove favorite"
    });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};