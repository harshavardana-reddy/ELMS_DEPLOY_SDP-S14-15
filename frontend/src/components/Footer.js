import React from 'react';

export default function Footer() {
  return (
    <div className='footer' style={{ borderRadius: '5px', position: 'fixed', left: 0, bottom: 0, width: '100%', height: '25px', backgroundColor: 'blue', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Times New Roman' }}>
      <h6 style={{color:'white'}} >&copy; Copyright 2024</h6>
    </div>
  );
}
