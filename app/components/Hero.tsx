import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <>
      {/* Two divs - Image left and paragraph right */}

      {/* parent div */}
      <div className="bg-white text-black py-5 h-screen">
        {/* sub-parent */}
        <div className="flex items-center gap-1">
          {/* image div */}
          <div className="w-1/2">
            <Image
              src={`/hero.jpg`}
              width={800}
              height={800}
              alt="hero-image"
            />
          </div>

          {/* paragraph div  */}
          <div className="w-1/2">
            <h1 className="text-3xl font-semibold">About us</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse
              dolores debitis molestiae accusantium similique officia adipisci,
              harum cupiditate iusto illum numquam voluptatum quo nesciunt
              obcaecati animi quod necessitatibus ipsum, possimus accusamus.
              Cumque saepe voluptates aut rem fugiat, modi labore sed iure, quas
              ab, optio quia temporibus tempore nostrum nesciunt quos!
            </p>

            <h1 className="text-2xl my-3 font-semibold">How it works?</h1>

            {/* How ts works children */}
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="font-semibold">Choose the service</h3>
                <p>Choose the perfect service for your car</p>
              </div>
              <div>
                <h3 className="font-semibold">Book an appointment</h3>
                <p>Book an appointment with us on your convenient date.</p>
              </div>
              <div>
                <h3 className="font-semibold">Get your car fixed</h3>
                <p>
                  No need to wait, our representatives will take care of
                  everything on their own.
                </p>
              </div>

              {/* button */}
            {/* todo: think where this button will redirect to */}
            <div 
            // onClick={} //todo: possible redirect here.
            className="bg-blue-500 w-1/3 text-center hover:cursor-pointer hover:bg-blue-400 text-white text-md px-3 py-2">
                Explore more
            </div>
            </div>

            
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
