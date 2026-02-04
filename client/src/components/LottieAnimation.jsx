import React from 'react';
import Lottie from 'lottie-react';
import pageLoader from '../lottie/page.json';
import mainLoader from '../lottie/main-loader.json';

const LottieAnimation = ({ status }) => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="max-w-[60%]">
        <Lottie
          animationData={status == 'page' ? pageLoader : mainLoader}
          loop={true}
        />
      </div>
    </div>
  );
};

export default LottieAnimation;
