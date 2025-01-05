import React, { useEffect, useState } from 'react';
import { TbMapPin, TbBrandHipchat, TbUser } from 'react-icons/tb';
import AgreeInfo from './ui/AgreeInfo';

interface RideBarProps {
  fromHome?: boolean;
}

const findRideFormFields = [
  {
    name: 'from',
    label: 'From',
    type: 'text',
    placeholder: 'Current Location',
  },
  {
    name: 'to',
    label: 'To',
    type: 'text',
    placeholder: 'Kathmandu BernHardt College',
  },
  {
    name: 'message',
    label: 'Message',
    type: 'text',
    placeholder: "I'm leaving in 5 minutes",
  },
  {
    name: 'role',
    label: "I'm a",
    type: 'select',
    options: ['Rider', 'Passenger'],
  },
];

const RideBarOG: React.FC<RideBarProps> = ({ fromHome = false }) => {
  const [showRideBar, setShowRideBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      const bottomThreshold = 100; // Adjust this value as needed

      if (
        scrollPosition > 0 &&
        scrollPosition + windowHeight < documentHeight - bottomThreshold
      ) {
        setShowRideBar(true);
      } else {
        setShowRideBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main
      className={`${fromHome ? `fixed bottom-0 z-40 w-full bg-none py-0 transition-all duration-500 ease-in-out ${window.scrollY > 0 ? 'py-0' : 'px-6'} ${showRideBar ? 'translate-y-0' : 'translate-y-20'} ` : `my-24 p-0`}`}
    >
      <form
        action=""
        className="flex items-center justify-between gap-2 rounded-full border bg-white p-2 shadow"
      >
        {findRideFormFields.map(
          ({ name, label, type, placeholder, options }) => (
            <div
              key={name}
              className="inline-flex w-full items-center rounded-full bg-teal-100"
            >
              <label
                htmlFor={name}
                className="inline-flex min-w-fit items-center gap-2 pl-4 text-sm"
              >
                {name === 'from' || name === 'to' ? (
                  <TbMapPin className="text-lg" />
                ) : null}
                {name === 'message' ? (
                  <TbBrandHipchat className="text-lg" />
                ) : null}
                {name === 'role' ? <TbUser className="text-lg" /> : null}
                {label}
              </label>
              {type === 'select' ? (
                <select
                  id={name}
                  className="mr-2 w-full rounded-full bg-transparent px-2 py-3 text-sm text-dark text-dark/50 ring-inset focus:ring-1 focus:ring-teal-600"
                >
                  {options?.map((option) => (
                    <option key={option} value={option.toLowerCase()}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  id={name}
                  className="w-full rounded-full bg-transparent px-2 py-3 text-sm text-dark ring-inset placeholder:text-dark/50 focus:ring-1 focus:ring-teal-600"
                  placeholder={placeholder}
                />
              )}
            </div>
          ),
        )}
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-teal-300 px-6 py-3 text-sm"
        >
          Confirm
        </button>
      </form>
      {!fromHome && <AgreeInfo />}
    </main>
  );
};

export default RideBarOG;
