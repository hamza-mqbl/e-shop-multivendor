import React from "react";
import Lottie from "react-lottie";
import animationData from "../../Assests/animations/24151-ecommerce-animation.json";

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Lottie options={defaultOptions} width={300} height={300} />
    </div>
  );
};

export default Loader;













// import React from 'react';

// const Loader = () => {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       {/* Simple moving loader component */}
//       <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 border-t-blue-500"></div>
//     </div>
//   );
// };

// export default Loader;
