import { useState } from "react";
import { useDispatch } from "react-redux";
import { addReview } from "../store/slices/review";


const AddReview = ({ movieId }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(addReview({ movieId, rating, comment }));
    setComment("");
  };

  return (
    <form onSubmit={submitHandler} className="space-y-3">
      <select
        value={rating}
        onChange={(e) => setRating(+e.target.value)}
        className="border p-2 rounded"
      >
        {[1,2,3,4,5].map((r) => (
          <option key={r} value={r}>
            {r} Star{r > 1 && "s"}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Submit Review
      </button>
    </form>
  );
};

export default AddReview;
