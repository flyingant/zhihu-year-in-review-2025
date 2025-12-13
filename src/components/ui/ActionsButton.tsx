"use client";

import React from "react";
import Image from "next/image";

import { useAssets } from "@/context/assets-context";

export type ActionType =
  | "subscribe"
  | "subscribed"
  | "message"
  | "join"
  | "joined";

interface ActionsButtonProps {
  type: ActionType;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const ActionsButton: React.FC<ActionsButtonProps> = ({
  type,
  onClick,
  className = "",
  disabled = false,
}) => {
  const { assets } = useAssets();

  if (!assets) return null;

  // Helper to get asset based on type
  const getAsset = (type: ActionType) => {
    switch (type) {
      case "subscribe":
        return assets.report.p16.subscribe;
      case "subscribed":
        return assets.report.p16.subscribed;
      case "message":
        return assets.report.p22.message;
      case "join":
        return assets.report.p22.join;
      case "joined":
        return assets.report.p22.joined;
      default:
        return null;
    }
  };

  const asset = getAsset(type);
  if (!asset) return null;

  const { url, width, height, alt } = asset;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        transition-all duration-200
        ${disabled ? "cursor-not-allowed" : "cursor-pointer hover:opacity-80"}
        ${className}
      `}
    >
      <Image
        src={url}
        alt={alt}
        width={width}
        height={height}
        className="object-contain"
      />
    </button>
  );
};

export default ActionsButton;
