const Opportunity = require("../models/opportunity");

// Get all opportunities, with optional search and category filter
const getOpportunities = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const regex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      filter.$or = [
        { title: regex },
        { company: regex }
      ];
    }

    if (category) {
      if (!["Internship", "Job"].includes(category)) {
        return res.status(400).json({
          message: "Invalid category"
        });
      }

      filter.category = category;
    }

    const opportunities = await Opportunity.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: opportunities.length,
      opportunities
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch opportunities"
    });
  }
};

// Get one opportunity
const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found"
      });
    }

    return res.status(200).json({ opportunity });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid opportunity ID"
    });
  }
};

// Create an opportunity (admin only)
const createOpportunity = async (req, res) => {
  try {
    const {
      title,
      company,
      category,
      skills,
      description,
      location,
      applyLink
    } = req.body;

    if (!title || !company || !category) {
      return res.status(400).json({
        message: "Title, company and category are required"
      });
    }

    if (!["Internship", "Job"].includes(category)) {
      return res.status(400).json({
        message: "Category must be Internship or Job"
      });
    }

    if (skills !== undefined && !Array.isArray(skills)) {
      return res.status(400).json({
        message: "Skills must be an array"
      });
    }

    const opportunity = await Opportunity.create({
      title,
      company,
      category,
      skills: skills || [],
      description,
      location,
      applyLink,
      createdBy: req.user._id
    });

    return res.status(201).json({
      message: "Opportunity created",
      opportunity
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create opportunity"
    });
  }
};

// Update an opportunity (admin only)
const updateOpportunity = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "company",
      "category",
      "skills",
      "description",
      "location",
      "applyLink"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide at least one field to update"
      });
    }

    if (
      updates.category !== undefined &&
      !["Internship", "Job"].includes(updates.category)
    ) {
      return res.status(400).json({
        message: "Invalid category"
      });
    }

    if (
      updates.skills !== undefined &&
      !Array.isArray(updates.skills)
    ) {
      return res.status(400).json({
        message: "Skills must be an array"
      });
    }

    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found"
      });
    }

    return res.status(200).json({
      message: "Opportunity updated",
      opportunity
    });
  } catch (error) {
    return res.status(400).json({
      message: "Unable to update opportunity"
    });
  }
};

// Delete an opportunity (admin only)
const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findByIdAndDelete(
      req.params.id
    );

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found"
      });
    }

    await require("../models/Favorite").deleteMany({
      opportunity: opportunity._id
    });

    return res.status(200).json({
      message: "Opportunity deleted"
    });
  } catch (error) {
    return res.status(400).json({
      message: "Unable to delete opportunity"
    });
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
};