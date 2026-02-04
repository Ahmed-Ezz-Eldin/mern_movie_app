import Movie from "../models/movie.js";
import Review from "../models/review.js";

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { movieId } = req.params;
    const userId = req.user.id; // Use _id consistently

    const existingReview = await Review.findOne({ movie: movieId, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this movie" });
    }

    // 1. Create the review
    let review = await Review.create({
      user: userId,
      movie: movieId,
      rating,
      comment,
    });

    // 2. Populate user info so the frontend can show the name immediately
    review = await review.populate("user", "username imgProfile");

    // 3. Update Movie
    const movie = await Movie.findById(movieId);
    movie.reviews.push(review._id);

    // 4. Recalculate Average Rating
    const reviews = await Review.find({ movie: movieId });
    movie.rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await movie.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
