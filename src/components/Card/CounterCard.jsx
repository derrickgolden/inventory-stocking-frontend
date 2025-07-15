import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Generate a random pastel background color (Tailwind-safe)
const getRandomBg = () => {
  const colors = [
    "bg-blue-100", "bg-pink-100", "bg-purple-100", "bg-green-100",
    "bg-orange-100", "bg-lime-100", "bg-indigo-100", "bg-cyan-100"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const CounterCard = ({ counter }) => {
  const navigate = useNavigate();
  const backgroundColor = getRandomBg();

  const { id, counterThumbnailImageUrl, name, description, users } = counter;

  const handleClick = () => {
    navigate(`/admin/sale/counter/${id}`);
  };

  return (
    <div
      className={`rounded-lg shadow-sm overflow-hidden m-2 cursor-pointer transition hover:shadow-md ${backgroundColor}`}
      onClick={handleClick}
    >
      {/* <img
        src={counterThumbnailImageUrl}
        alt={name}
        className="w-full h-44 object-cover"
      /> */}
      <div className="p-4 text-center ">
        <h5 className="text-lg font-semibold mb-1">{name}</h5>
        <p className="text-lg text-gray-600 mb-2 line-clamp-2">{description}</p>
        <p className="text-sm text-gray-500">Bartender:  
            <span className="font-semibold text-lg">{users?.username}</span>
        </p>
      </div>
    </div>
  );
};

CounterCard.propTypes = {
  counter: PropTypes.shape({
    id: PropTypes.number.isRequired,
    counterThumbnailImageUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    users: PropTypes.shape({
      username: PropTypes.string
    })
  }).isRequired
};

export default CounterCard;
