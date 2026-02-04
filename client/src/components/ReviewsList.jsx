import { serverAPI } from "../api/axios";

const ReviewsList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) 
    return <p className="text-gray-500 mt-4">No reviews yet</p>;

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold">User Reviews</h3>
      {reviews.map((review) => (
        <div key={review._id} className="border-b border-gray-200 pb-4 flex gap-4">
          <img 
            src={review.user?.imgProfile ? `${serverAPI}/${review.user.imgProfile}` : '/default-avatar.png'} 
            className="w-10 h-10 rounded-full object-cover"
            alt="profile"
          />
          <div>
            <p className="font-semibold text-blue-600">
              {review.user?.username || "Anonymous"}
            </p>
            <p className="text-yellow-500">{"⭐".repeat(review.rating)}</p>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList