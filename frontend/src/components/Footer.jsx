import React from 'react';
import { Notebook as Robot, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">Programs</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                    Workshops
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                    Events
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">Products</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                    Robotics Kits
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                    Components
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                    Software
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">Contact</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    info@mechatech.com
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    +1 (555) 123-4567
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    123 Tech Street
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center">
            <Robot className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white">MechaTech</span>
          </div>
          <p className="mt-8 text-center text-xs leading-5 text-gray-400">
            &copy; 2024 MechaTech Robotics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;