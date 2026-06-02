const Product = require("../models/product.js")
const Review = require("../models/review.js")
const cloudinary = require("../config/cloudConfig.js")
const fs = require("fs")

module.exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        if (products) {
            return res.json({ error: false, products })
        } else {
            return res.status(404).json({ error: true, message: "Product is not available." })
        }
    } catch (err) {
        next(err);
    }
}
module.exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, stock } = req.body;
        let imageUrl = ''
        if (req.file) {
            console.log(req.file);
            const result = await cloudinary.uploader.upload(req.file.path)
            fs.unlinkSync(req.file.path)
            imageUrl = result.secure_url
        }
        const product = new Product({ name, description, price, category : category.trim().toLowerCase(), stock, imageUrl });
        await product.save();
        return res.status(201).json({ error: false, message: "Product created succesfully.", product })
    } catch (err) {
        next(err);
    }
}
module.exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json({ error: false, product });
        } else {
            res.status(404).json({ error: true, message: "Product not found." })
        }
    } catch (err) {
        next(err);
    }
}
module.exports.updateProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category.trim().toLowerCase() || product.category;
            product.stock = stock || product.stock;
            if (req.file) {
                const result = cloudinary.uploader.upload(req.file.path);
                fs.unlinkSync(req.file.path) // now it will delete the image uploaded locally.
                product.imageUrl = result.secure_url;
            }
            await product.save();
            return res.status(201).json({ message: "Updated succesfully" })
        } else {
            return res.status(404).json({ error: true, message: "Product not found." })
        }
    } catch (err) {
        next(err);
    }
}

module.exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: true, message: "Product do not exist." })
        } else {
            await Product.findByIdAndDelete(req.params.id);
            return res.status(400).json({ error: false, message: "Product deleted succesfully." })
        }
    } catch (err) {
        next(err);
    }
}
module.exports.getProductByfilter = async (req, res) => {
    try {
        const { search, category, sort } = req.query;

        let filter = {};
        let sortOption = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" }; 
        }

        if (category && category !== "all") {
            filter.category = category.trim().toLowerCase();
        }

        switch (sort) {
            case "price-low":
                sortOption = { price: 1 };
                break;
            case "price-high":
                sortOption = { price: -1 };
                break;
            case "rating":
                sortOption = { rating: -1 };
                break;
            case "newest":
                sortOption = { createdAt: -1 };
                break;
            default:
                sortOption = {};
        }

        const products = await Product.find(filter).sort(sortOption);

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports.rateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: true, message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: true, message: "Product not found" });
    }

    let review = await Review.findOne({ user: userId, product: id });

    if (review) {
      review.rating = rating;
      await review.save();
    } else {
      await Review.create({ user: userId, product: id, rating });
    }

    const reviews = await Review.find({ product: id });
    const numReviews = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

    await Product.findByIdAndUpdate(id, {
      ratings: avgRating,
      numReviews,
    });

    return res.status(200).json({
      error: false,
      message: "Rating submitted successfully",
      ratings: avgRating,
      numReviews,
    });
  } catch (err) {
    next(err);
  }
};

