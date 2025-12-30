import React from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ title, value }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between h-32 hover:shadow-md transition-all duration-300">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</p>
        <h2 className="text-3xl font-extrabold text-[#1BA0E2] mt-2 truncate">
            {value}
        </h2>
    </div>
);

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default StatCard;