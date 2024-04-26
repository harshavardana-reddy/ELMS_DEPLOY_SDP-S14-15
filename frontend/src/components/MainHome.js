import React, { useEffect } from 'react';
import NavBar1 from '../navigationbar/NavBar1';
import image21 from './images/21.png'; 
import Typed from 'typed.js'; 

export default function MainHome() {
  useEffect(() => {
    const typed = new Typed('#typed-text', {
      strings: ['Welcome To Employee Leave Management System'], 
      typeSpeed: 50,
      loop: false,
    });

    // Cleanup function
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mt-8 text-center">
          <span id="typed-text"></span> {/* Placeholder for typed text */}
        </h1>
        <p className="mt-4 text-center">
          
        </p>
        <div className="flex justify-center">
          <img src={image21} alt="Employee Leave Management System" className="mt-8 max-w-full h-auto lg:max-w-none lg:h-auto" />
        </div>
      </div>
    </div>
  );
}
