import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <div className='navbar bg-base-100'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <div
            tabIndex={0}
            role='button'
            className='btn btn-ghost btn-circle'
            onClick={toggleDropdown}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-8 w-8'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h16M4 18h7'
              />
            </svg>
          </div>
          {dropdownOpen && (
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li>
                <Link to='/' onClick={closeDropdown} className='text-lg'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/plants' onClick={closeDropdown} className='text-lg'>
                  Your Plants
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className='navbar-end'>
        <a className='btn btn-ghost text-xl'>H2Oasis</a>
      </div>
    </div>
  );
};

export default Navbar;
