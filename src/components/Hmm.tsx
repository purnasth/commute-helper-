import React, { useEffect, useState } from 'react';
import {
  TbMapPin,
  TbBrandHipchat,
  TbUser,
  TbCurrentLocation,
  TbSearch,
  TbX,
  TbClock,
  TbMessageCircle,
} from 'react-icons/tb';
import AgreeInfo from './ui/AgreeInfo';

interface RideBarProps {
  fromHome?: boolean;
}

interface Location {
  id: string;
  name: string;
  address: string;
}

interface QuickMessage {
  id: string;
  text: string;
  icon: React.ReactNode;
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

const mockLocations: Location[] = [
  { id: '1', name: 'Kathmandu Mall', address: 'Sundhara, Kathmandu' },
  { id: '2', name: 'BernHardt College', address: 'Bafal, Kathmandu' },
  { id: '3', name: 'Civil Mall', address: 'Sundhara, Kathmandu' },
];

const quickMessages: QuickMessage[] = [
  {
    id: '4',
    text: "I'm leaving now",
    icon: <TbClock className="text-xl text-teal-500" />,
  },
  {
    id: '5',
    text: "I'll be there in 5 minutes",
    icon: <TbClock className="text-xl text-teal-500" />,
  },
  {
    id: '6',
    text: 'See you at the location',
    icon: <TbMessageCircle className="text-xl text-teal-500" />,
  },
];

const RideBar: React.FC<RideBarProps> = ({ fromHome = false }) => {
  const [showRideBar, setShowRideBar] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [formValues, setFormValues] = useState({
    from: '',
    to: '',
    message: '',
    role: 'passenger',
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      const bottomThreshold = 100;

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

  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = mockLocations.filter((loc) =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();
          setFormValues((prev) => ({
            ...prev,
            from: data.display_name,
          }));
          setShowLocationPopup(false);
          setSearchQuery('');
        },
        (error) => {
          console.error('Error fetching location:', error);
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleLocationSelect = (location: Location) => {
    setFormValues((prev) => ({
      ...prev,
      [activeInput!]: location.name,
    }));
    setShowLocationPopup(false);
    setSearchQuery('');
  };

  const handleMessageSelect = (message: string) => {
    setFormValues((prev) => ({
      ...prev,
      message: message,
    }));
    setShowMessagePopup(false);
    setCustomMessage('');
  };

  const handleInputClick = (fieldName: string) => {
    if (fieldName === 'from' || fieldName === 'to') {
      setActiveInput(fieldName as 'from' | 'to');
      setShowLocationPopup(true);
      setShowMessagePopup(false);
    } else if (fieldName === 'message') {
      setShowMessagePopup(true);
      setShowLocationPopup(false);
    }
  };

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
                  value={formValues[name as keyof typeof formValues]}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      [name]: e.target.value,
                    }))
                  }
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
                  value={formValues[name as keyof typeof formValues]}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      [name]: e.target.value,
                    }))
                  }
                  onClick={() => handleInputClick(name)}
                  readOnly={name === 'from' || name === 'to'}
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

      {/* Location Popup */}
      {showLocationPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Choose{' '}
                {activeInput === 'from' ? 'Starting Point' : 'Destination'}
              </h2>
              <button
                onClick={() => setShowLocationPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <TbX className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:border-teal-500 focus:outline-none"
                />
                <TbSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            {activeInput === 'from' && (
              <div
                className="mb-3 flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50"
                onClick={getCurrentLocation}
              >
                <TbCurrentLocation className="text-xl text-teal-500" />
                <div>
                  <p className="font-medium">Use Current Location</p>
                  <p className="text-sm text-gray-500">Find your location</p>
                </div>
              </div>
            )}

            <button className="mb-4 w-full rounded-lg border border-teal-500 p-3 text-center text-teal-500 hover:bg-teal-50">
              Choose on Map
            </button>

            <div className="space-y-3">
              {suggestions.map((location) => (
                <div
                  key={location.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50"
                  onClick={() => handleLocationSelect(location)}
                >
                  <TbMapPin className="text-xl text-teal-500" />
                  <div>
                    <p className="font-medium">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showMessagePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Choose or Write Message</h2>
              <button
                onClick={() => setShowMessagePopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <TbX className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Write custom message..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:border-teal-500 focus:outline-none"
                />
                {customMessage && (
                  <button
                    onClick={() => handleMessageSelect(customMessage)}
                    className="absolute right-3 top-3 text-teal-500 hover:text-teal-600"
                  >
                    <TbMessageCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {quickMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50"
                  onClick={() => handleMessageSelect(message.text)}
                >
                  {message.icon}
                  <p className="font-medium">{message.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default RideBar;
