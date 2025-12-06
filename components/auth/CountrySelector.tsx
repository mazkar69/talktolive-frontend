import { useState, useRef, useEffect } from "react";
import countriesData from '../../lib/countryData.json';

interface CountrySelectProps {
  countryCode: string;
  setCountryCode: (code: string) => void;
}

interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  flag: string;
  idd: {
    root: string;
    suffixes?: string[];
  };
  capital?: string[];
  cca2: string;
  altSpellings?: string[];
}

interface SelectedCountry {
  name: string;
  flag: string;
  code: string;
}

export default function CountrySelector({ countryCode, setCountryCode }: CountrySelectProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<SelectedCountry | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countries = countriesData as Country[];

  // Initialize with India as default or find country by code
  useEffect(() => {
    if (countryCode) {
      const country = countries.find(c => {
        const code = c.idd.root + (c.idd.suffixes?.[0] || "");
        return code === countryCode;
      });
      if (country) {
        const code = country.idd.root + (country.idd.suffixes?.[0] || "");
        setSelectedCountry({
          name: country.name.common,
          flag: country.flags.png,
          code: code
        });
      }
    } else {
      // Default to India
      const india = countries.find(c => c.cca2 === "IN");
      if (india) {
        const code = india.idd.root + (india.idd.suffixes?.[0] || "");
        setSelectedCountry({
          name: india.name.common,
          flag: india.flags.png,
          code: code
        });
        setCountryCode(code);
      }
    }
  }, [countryCode, setCountryCode, countries]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country: Country) => {
    const code = country.idd.root + (country.idd.suffixes?.[0] || "");
    const countryCode = country.flag;
    setSelectedCountry({
      name: country.name.common,
      flag: country.flags.png,
      code: code
    });
    setCountryCode(countryCode);
    console.log("Selected country code:", countryCode);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const filteredCountries = countries.filter(country => {
    const searchText = `${country.name.common} ${country.capital?.join(" ") || ""} ${country.altSpellings?.join(" ") || ""} ${country.idd.root}${country.idd.suffixes?.[0] || ""}`;
    return searchText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-between gap-2 px-3 py-3 cursor-pointer hover:border-blue-gray-400 transition-colors  min-w-[100px] bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
      >
        {selectedCountry ? (
          <div className="flex items-center gap-2">
            <img 
              src={selectedCountry.flag} 
              alt={selectedCountry.name}
              className="w-6 h-4 object-cover rounded"
            />
          
            <span>
              {selectedCountry.name}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Select</span>
        )}

        <svg
          className={` w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>

      </div>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
            <input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Country List */}
          <div className="overflow-y-auto max-h-80">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const flag = country.flag;
                return (
                  <div
                    key={country.cca2}
                    onClick={() => handleCountrySelect(country)}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                      selectedCountry?.flag === flag ? 'bg-blue-50' : ''
                    }`}
                  >
                    <img 
                      src={country.flags.png} 
                      alt={country.name.common}
                      className="w-6 h-4 object-cover rounded"
                    />
                    <span className="flex-1 text-sm text-gray-700">
                      {country.name.common}
                    </span>
         
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
