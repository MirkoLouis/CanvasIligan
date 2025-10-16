
import React, { useState, useCallback, useMemo } from 'react';
import { type Product, type Store } from './types';
import { performSemanticSearch } from './services/geminiService';
import SearchBar from './components/SearchBar';
import ProductCard from './components/ProductCard';
import LoadingSpinner from './components/LoadingSpinner';

const STORES: Store[] = [
  { name: "Iligan Electronics Hub", address: "Quezon Ave Ext, Iligan City" },
  { name: "Component Corner", address: "Roxas Ave, Iligan City" },
  { name: "Tech Parts Plus", address: "Aguinaldo St, Iligan City" },
  { name: "Circuit Central", address: "Mabini St, Iligan City" },
];

const RAW_PRODUCTS = [
    { id: 1, name: "Arduino Uno R3", category: "Microcontroller", price: 25.00, description: "A popular open-source microcontroller board based on the ATmega328P. Ideal for beginners and advanced users for building interactive projects.", mpn: "A000066", manufacturer: "Arduino", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=Uno" },
    { id: 2, name: "Raspberry Pi 4 Model B (4GB)", category: "Single-Board Computer", price: 55.00, description: "A credit-card-sized computer with 4GB RAM, quad-core CPU, and wireless networking. Powerful enough for robotics or home automation.", mpn: "RPI4-MODBP-4GB", manufacturer: "Raspberry Pi", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=Pi+4" },
    { id: 3, name: "5mm Red LED (Pack of 100)", category: "Component", price: 5.99, description: "Standard 5mm red light-emitting diodes. Bright and reliable, perfect for indicators, displays, and hobbyist projects.", mpn: "L-53HD", manufacturer: "Kingbright", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=LED" },
    { id: 4, name: "220 Ohm Resistor (Pack of 100)", category: "Component", price: 4.50, description: "1/4 watt, 5% tolerance carbon film resistors. Essential for limiting current in circuits, commonly used with LEDs.", mpn: "CF14JT220R", manufacturer: "Yageo", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=220Ω" },
    { id: 5, name: "SG90 Micro Servo Motor", category: "Motor", price: 8.99, description: "A lightweight, high-torque micro servo motor. Ideal for robotics, RC airplanes, and other small mechanical projects.", mpn: "SG90", manufacturer: "Tower Pro", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=SG90" },
    { id: 6, name: "HC-SR04 Ultrasonic Sensor", category: "Sensor", price: 7.50, description: "Distance measuring sensor that uses sonar to determine distance to an object. Great for robotics and interactive projects.", mpn: "HC-SR04", manufacturer: "Generic", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=SR04" },
    { id: 7, name: "Breadboard (830 Point)", category: "Prototyping", price: 9.99, description: "Solderless breadboard with 830 tie-points. Perfect for prototyping and testing circuits without soldering.", mpn: "BB830", manufacturer: "Generic", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=Board" },
    { id: 8, name: "Jumper Wires (M-M, M-F, F-F)", category: "Prototyping", price: 12.00, description: "A pack of 120 flexible jumper wires in various colors and connector types for breadboarding and prototyping.", mpn: "JW-120", manufacturer: "Generic", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=Wires" },
    { id: 9, name: "ESP32-DevKitC V4", category: "Microcontroller", price: 15.00, description: "A powerful development board with WiFi and Bluetooth. Suitable for a wide range of IoT applications.", mpn: "ESP32-DEVKITC-32D", manufacturer: "Espressif Systems", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=ESP32" },
    { id: 10, name: "16x2 LCD Display with I2C", category: "Display", price: 11.50, description: "A 16-character by 2-line display with a blue backlight. The I2C interface simplifies connection to microcontrollers.", mpn: "LCD1602-I2C", manufacturer: "Generic", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=LCD" },
    { id: 11, name: "DHT11 Temperature & Humidity Sensor", category: "Sensor", price: 6.00, description: "A basic, low-cost digital temperature and humidity sensor. A popular choice for weather stations and environmental monitoring.", mpn: "DHT11", manufacturer: "Aosong", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=DHT11" },
    { id: 12, name: "L298N Motor Driver Module", category: "Motor Controller", price: 9.75, description: "A dual H-bridge motor driver capable of controlling the speed and direction of two DC motors or one stepper motor.", mpn: "L298N-MOD", manufacturer: "STMicroelectronics", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=L298N" },
    { id: 13, name: "9V Battery Clip Connector", category: "Accessory", price: 2.50, description: "A standard connector for a 9V battery, with tinned wire leads for easy connection to a breadboard or circuit.", mpn: "9V-CLIP", manufacturer: "Generic", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=9V" },
    { id: 14, name: "NE555P Timer IC", category: "Integrated Circuit", price: 3.00, description: "A highly stable integrated circuit for generating accurate time delays or oscillations. A fundamental building block in electronics.", mpn: "NE555P", manufacturer: "Texas Instruments", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=555" },
    { id: 15, name: "10k Ohm Potentiometer", category: "Component", price: 3.50, description: "A three-terminal variable resistor. Commonly used as a control input for adjusting volume, brightness, or speed.", mpn: "P-10K", manufacturer: "Generic", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=10kΩ" },
    { id: 16, name: "Active Piezo Buzzer Module", category: "Audio", price: 4.25, description: "A simple module that produces a single-tone sound when powered. Great for alarms, alerts, and user feedback in projects.", mpn: "BUZ-ACT", manufacturer: "Generic", imageUrl: "https://placehold.co/100x100/8491D9/FFFFFF/png?text=Buzzer" },
];

const getFullInventory = (): Product[] => {
  return RAW_PRODUCTS.map((product, index) => ({
    ...product,
    store: STORES[index % STORES.length],
  }));
};


const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fullInventory = useMemo(() => getFullInventory(), []);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setSearchResults([]);

    try {
      const results = await performSemanticSearch(searchQuery, fullInventory);
      setSearchResults(results);
    } catch (err)
 {
      setError('Failed to fetch results. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fullInventory]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <p className="text-center text-red-500 mt-8">{error}</p>;
    }
    if (searchResults.length > 0) {
      return (
        <div className="space-y-4 max-w-4xl mx-auto">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      );
    }
    if (hasSearched) {
      return <p className="text-center text-gray-500 mt-8">No products found matching your search.</p>;
    }
    return null;
  };

  return (
    <div className="min-h-screen font-sans">
      <div
        className={`transition-all duration-[2500ms] ease-in-out ${hasSearched ? 'pt-8' : 'pt-[35vh]'}`}
      >
        <div className="container mx-auto px-4">
          <header className={`flex flex-col items-center transition-all duration-[2500ms] ease-in-out ${hasSearched ? 'mb-8' : 'pb-4'}`}>
             <h1 className={`text-4xl sm:text-5xl font-bold text-gray-800 transition-all duration-[2500ms] ease-in-out mb-4 ${hasSearched ? 'text-2xl' : ''}`}>
              Canvas<span className="text-main-accent">Iligan</span>
            </h1>
            <div className="w-full max-w-2xl">
              <SearchBar initialQuery={query} onSearch={handleSearch} isLoading={isLoading} />
            </div>
            <p className={`text-gray-500 text-center transition-all duration-[2500ms] ease-in-out overflow-hidden ${hasSearched ? 'opacity-0 max-h-0 mt-0' : 'opacity-100 max-h-40 mt-4'}`}>
              Find any product by name, use, or description—and see where it's available in Iligan's local stores
            </p>
          </header>

          {hasSearched && (
             <main>
               {renderContent()}
             </main>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
