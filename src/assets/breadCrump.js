// Breadcrumb.js
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  ChevronDownIcon, ShoppingCartIcon, ListBulletIcon, HeartIcon,
  MagnifyingGlassIcon, UserCircleIcon, PowerIcon, XMarkIcon, Bars3Icon,BellIcon,CheckCircleIcon,ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

const Breadcrumb = ({ paths }) => {
  return (
    <nav className="bg-gray-100 p-4 rounded flex flex-col items-start w-md">
      <ol className="list-reset flex text-blue-600">
        {paths.map((path, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2"><ChevronDoubleRightIcon className="w-4 h-4 mr-2 text-gray-600" /></span>}
            {index === paths.length - 1 ? (
              <span className="text-gray-500">{path.label}</span>
            ) : (
              <Link to={path.href} className="text-blue-600 hover:underline">
                {path.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  paths: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string
    })
  ).isRequired
};

export default Breadcrumb;
