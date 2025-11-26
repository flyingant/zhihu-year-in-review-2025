"use client";

import { useState, useEffect } from "react";
import { getAddressRegions, RegionData } from "@/api/campaign";

interface Region {
  code: string;
  name: string;
  children?: Region[];
}

interface RegionPickerProps {
  selectedRegion: string;
  onSelect: (region: string) => void;
  onClose: () => void;
}

// Convert API data structure to internal Region structure
const convertRegionData = (apiData: RegionData[]): Region[] => {
  return apiData.map((province) => ({
    code: province.abcode || "",
    name: province.name,
    children: province.city.map((city) => ({
      code: city.code,
      name: city.name,
      children: city.area.map((area) => ({
        code: area.code,
        name: area.name,
      })),
    })),
  }));
};

export default function RegionPicker({
  selectedRegion,
  onSelect,
  onClose,
}: RegionPickerProps) {
  const [regionData, setRegionData] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<Region | null>(null);
  const [selectedCity, setSelectedCity] = useState<Region | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<Region | null>(null);

  // Fetch region data from API
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const data = await getAddressRegions();
        const convertedData = convertRegionData(data);
        setRegionData(convertedData);
        
        // Set default selection if no region is selected
        if (convertedData.length > 0 && !selectedRegion) {
          setSelectedProvince(convertedData[0]);
          if (convertedData[0].children && convertedData[0].children.length > 0) {
            setSelectedCity(convertedData[0].children[0]);
            if (
              convertedData[0].children[0].children &&
              convertedData[0].children[0].children.length > 0
            ) {
              setSelectedDistrict(convertedData[0].children[0].children[0]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch region data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  // Parse selected region string to initialize selections
  useEffect(() => {
    if (selectedRegion && regionData.length > 0) {
      const parts = selectedRegion.split(" ");
      if (parts.length >= 3) {
        const provinceName = parts[0];
        const cityName = parts[1];
        const districtName = parts[2];

        const province = regionData.find((p) => p.name === provinceName);
        if (province) {
          setSelectedProvince(province);
          const city = province.children?.find((c) => c.name === cityName);
          if (city) {
            setSelectedCity(city);
            const district = city.children?.find((d) => d.name === districtName);
            if (district) {
              setSelectedDistrict(district);
            }
          }
        }
      }
    }
  }, [selectedRegion, regionData]);

  // Update city when province changes
  useEffect(() => {
    if (selectedProvince && selectedProvince.children) {
      const newCity = selectedProvince.children[0];
      setSelectedCity(newCity);
      if (newCity.children && newCity.children.length > 0) {
        setSelectedDistrict(newCity.children[0]);
      } else {
        setSelectedDistrict(null);
      }
    }
  }, [selectedProvince]);

  // Update district when city changes
  useEffect(() => {
    if (selectedCity && selectedCity.children) {
      setSelectedDistrict(selectedCity.children[0]);
    } else {
      setSelectedDistrict(null);
    }
  }, [selectedCity]);

  const handleConfirm = () => {
    if (selectedProvince && selectedCity && selectedDistrict) {
      const regionString = `${selectedProvince.name} ${selectedCity.name} ${selectedDistrict.name}`;
      onSelect(regionString);
    }
  };

  const provinces = regionData;
  const cities = selectedProvince?.children || [];
  const districts = selectedCity?.children || [];

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-end">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full bg-white rounded-t-2xl shadow-lg h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full bg-white rounded-t-2xl shadow-lg h-[400px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2 className="text-base font-medium text-gray-900">选择地区</h2>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-[#056DE8] text-white rounded-lg text-sm font-medium"
          >
            确认
          </button>
        </div>

        {/* Picker Columns */}
        <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(400px - 57px)' }}>
          {/* Province Column */}
          <div className="flex-1 overflow-y-auto border-r border-gray-200">
            {provinces.map((province, index) => (
              <button
                key={province.code || province.name || `province-${index}`}
                onClick={() => setSelectedProvince(province)}
                className={`w-full text-left px-4 py-3 text-sm ${
                  selectedProvince?.code === province.code
                    ? "bg-blue-50 text-[#056DE8] font-medium"
                    : "text-gray-900"
                }`}
              >
                {province.name}
              </button>
            ))}
          </div>

          {/* City Column */}
          {cities.length > 0 && (
            <div className="flex-1 overflow-y-auto border-r border-gray-200">
              {cities.map((city, index) => (
                <button
                  key={city.code || city.name || `city-${index}`}
                  onClick={() => setSelectedCity(city)}
                  className={`w-full text-left px-4 py-3 text-sm ${
                    selectedCity?.code === city.code
                      ? "bg-blue-50 text-[#056DE8] font-medium"
                      : "text-gray-900"
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          )}

          {/* District Column */}
          {districts.length > 0 && (
            <div className="flex-1 overflow-y-auto">
              {districts.map((district, index) => (
                <button
                  key={district.code || district.name || `district-${index}`}
                  onClick={() => setSelectedDistrict(district)}
                  className={`w-full text-left px-4 py-3 text-sm ${
                    selectedDistrict?.code === district.code
                      ? "bg-blue-50 text-[#056DE8] font-medium"
                      : "text-gray-900"
                  }`}
                >
                  {district.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
