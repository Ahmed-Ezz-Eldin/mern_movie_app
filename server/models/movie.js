import mongoose from 'mongoose';
const movieSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    desc: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    posterImg: {
      url: String,
      public_id: String,
    },
    videoUrl: {
      url: String,
      public_id: String,
    },
    rating: { type: Number, default: 0 },
    price: { type: Number, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
