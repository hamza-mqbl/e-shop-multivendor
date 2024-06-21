import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      {/* Simple moving loader component */}
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 border-t-blue-500"></div>
    </div>
  );
};

export default Loader;
