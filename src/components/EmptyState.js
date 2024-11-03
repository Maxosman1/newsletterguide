import React from "react";
import PropTypes from "prop-types";

export default function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-16 h-16 mb-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12H9m12 8.25V19.5a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 19.5v.75M18 15l-6 6m0 0l-6-6m6 6V3"
        />
      </svg>
      <p>{message}</p>
    </div>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
};
