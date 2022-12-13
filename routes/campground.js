const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemas/validateCampground.js");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Form Data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully made a new camp!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate("reviews");
    if (!camp) {
      req.flash("error", "Cannot find that campground!!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { camp });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
      req.flash("error", "The campground has been deleted!!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { camp });
  })
);

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated camp!");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully delete a camp!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
