"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/toast-context";
import { getAddressInfo, submitAddress } from "@/api/campaign";
import RegionPicker from "./RegionPicker";

interface AddressFormData {
  region: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  detailedAddress: string;
  recipientName: string;
  phoneNumber: string;
}

export default function AddressForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<AddressFormData>({
    region: "",
    provinceName: "",
    cityName: "",
    districtName: "",
    detailedAddress: "",
    recipientName: "",
    phoneNumber: "",
  });
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing address on mount
  useEffect(() => {
    const fetchExistingAddress = async () => {
      try {
        setIsLoading(true);
        const addressInfo = await getAddressInfo();
        if (addressInfo) {
          const regionString = `${addressInfo.province_name} ${addressInfo.city_name} ${addressInfo.district_name}`;
          setFormData({
            region: regionString,
            provinceName: addressInfo.province_name,
            cityName: addressInfo.city_name,
            districtName: addressInfo.district_name,
            detailedAddress: addressInfo.address_detail || "",
            recipientName: addressInfo.receiver || "",
            phoneNumber: addressInfo.mobile || "",
          });
        }
      } catch {
        // If address doesn't exist, that's fine - form will be empty
        console.log("No existing address found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingAddress();
  }, []);

  // Prevent body scroll when region picker is open
  useEffect(() => {
    if (showRegionPicker) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showRegionPicker]);

  const handleBack = () => {
    router.back();
  };

  const handleRegionSelect = (region: string) => {
    const parts = region.split(" ");
    setFormData((prev) => ({
      ...prev,
      region,
      provinceName: parts[0] || "",
      cityName: parts[1] || "",
      districtName: parts[2] || "",
    }));
    setShowRegionPicker(false);
  };

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.region) {
      showToast("请选择所在地区", "error");
      return false;
    }
    if (!formData.detailedAddress.trim()) {
      showToast("请输入详细地址与门牌号", "error");
      return false;
    }
    if (!formData.recipientName.trim()) {
      showToast("请输入收货人姓名", "error");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      showToast("请输入手机号", "error");
      return false;
    }
    // Validate phone number format (11 digits, starting with 1)
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      showToast("请输入正确的手机号", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitAddress({
        receiver: formData.recipientName.trim(),
        mobile: formData.phoneNumber.trim(),
        province_name: formData.provinceName,
        city_name: formData.cityName,
        district_name: formData.districtName,
        address_detail: formData.detailedAddress.trim(),
      });
      
      showToast("地址提交成功", "success");
      // Redirect back after successful submission
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Failed to submit address:", error);
      showToast("提交失败，请重试", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10">
        <div className="flex items-center justify-center h-[44px] relative">
          <button
            onClick={handleBack}
            className="absolute left-4 p-2 -ml-2 text-gray-600"
            aria-label="返回"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-[#056DE8] text-base font-medium">收货地址</h1>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 pt-6 pb-24">
        {/* Region Field */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowRegionPicker(true)}
            className="w-full text-left pb-3 border-b border-gray-200 focus:outline-none focus:border-blue-500"
          >
            <span
              className={
                formData.region
                  ? "text-gray-900"
                  : "text-gray-400"
              }
            >
              {formData.region || "*所在地区"}
            </span>
          </button>
        </div>

        {/* Detailed Address Field */}
        <div className="mb-6">
          <input
            type="text"
            value={formData.detailedAddress}
            onChange={(e) =>
              handleInputChange("detailedAddress", e.target.value)
            }
            placeholder="*详细地址与门牌号"
            className="w-full pb-3 border-b border-gray-200 focus:outline-none focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Recipient Name Field */}
        <div className="mb-6">
          <input
            type="text"
            value={formData.recipientName}
            onChange={(e) => handleInputChange("recipientName", e.target.value)}
            placeholder="*收货人姓名"
            className="w-full pb-3 border-b border-gray-200 focus:outline-none focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Phone Number Field */}
        <div className="mb-6">
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            placeholder="*手机号"
            maxLength={11}
            className="w-full pb-3 border-b border-gray-200 focus:outline-none focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Notice Text */}
        <p className="text-xs text-gray-500 mb-8">
          收货地址不支持更换,请确保地址准确
        </p>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 rounded-full bg-white border-t border-gray-200 p-4 pb-safe">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#056DE8] text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "提交中..." : "确认地址"}
        </button>
      </div>

      {/* Region Picker Modal */}
      {showRegionPicker && (
        <RegionPicker
          selectedRegion={formData.region}
          onSelect={handleRegionSelect}
          onClose={() => setShowRegionPicker(false)}
        />
      )}
    </div>
  );
}

