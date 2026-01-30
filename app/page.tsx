'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-12 px-4 flex-grow flex items-center">
      <div className="flex flex-col md:flex-row items-center gap-12 w-full">
        {/* Left Column: Image */}
        <div className="w-full md:w-[45%]">
            <div className="relative w-full aspect-[4/3] max-w-lg mx-auto md:mx-0">
               {/* Using the hero.jpg we generated/created */}
               <img 
                 src="/hero.jpg" 
                 alt="Mechanic working on car"
                 className="object-cover w-full h-full rounded shadow-md"
               />
            </div>
        </div>

        {/* Right Column: Content */}
        <div className="w-full md:w-[55%] space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">About Us</h2>
            <p className="text-lg font-semibold text-gray-700 italic mb-4">
              &quot;One stop solution to get your car repaired and serviced&quot;.
            </p>
            <p className="text-gray-600 leading-relaxed">
              At AutoMob-Mechanic, we aim to make the car repair and service experience straightforward by providing
              services for repairing, servicing and maintaining - lending our expertise in all forms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">How it Works?</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Choose the service</h3>
              </div>
              <div>
                <h3 className="font-normal text-gray-600">Choose the perfect service for your car.</h3>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-900">Book an Appointment</h3>
                <p className="text-gray-600 mt-1">Book an appointment with us on your convenient date.</p>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-900">Get your Car Fixed</h3>
                <p className="text-gray-600 mt-1">
                  No need to wait, our representative will take care of everything on their own.
                </p>
              </div>
            </div>
          </section>

          <button
            onClick={() => router.push('/services')}
            className="bg-automob-blue hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition duration-200"
          >
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
}