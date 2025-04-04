import React from "react";
import {
  LockClosedIcon,
  ScissorsIcon,
  ShieldExclamationIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  UserIcon,
  InformationCircleIcon,
  IdentificationIcon,
  PlusIcon,
  AcademicCapIcon,
  TrashIcon,
  FaceFrownIcon,
} from "@heroicons/react/16/solid";

// 🔑 Define Props Interface for LockIcon
interface LockIconProps {
  textColorClass?: "text-white" | "text-black" | string; // Add specific classes for better type safety
}

export const LockIcon: React.FC<LockIconProps> = ({
  textColorClass = "text-black",
}) => {
  // ✅ Dynamically set stroke and fill based on the provided textColorClass
  const iconColor = textColorClass === "text-white" ? "#FFF" : "#000";

  return (
    <div className="absolute bottom-2 right-2">
      <LockClosedIcon
        className="size-6"
        style={{
          stroke: iconColor,
          fill: iconColor,
        }}
      />
    </div>
  );
};

export const ActionLock: React.FC<LockIconProps> = ({
  textColorClass = "text-black",
}) => {
  return <LockClosedIcon className="size-5" />;
};

export const ScissorIcon: React.FC<LockIconProps> = ({
  textColorClass = "text-black",
}) => {
  // ✅ Dynamically set stroke and fill based on the provided textColorClass
  const iconColor = textColorClass === "text-white" ? "#FFF" : "#000";

  return <ScissorsIcon className="size-5" />;
};

export const ShieldExclamation: React.FC<LockIconProps> = ({
  textColorClass = "text-black",
}) => {
  // ✅ Dynamically set stroke and fill based on the provided textColorClass
  const iconColor = textColorClass === "text-white" ? "#FFF" : "#000";

  return <ShieldExclamationIcon className="size-5" />;
};

export const ShieldCheck: React.FC<LockIconProps> = ({
  textColorClass = "text-black",
}) => {
  // ✅ Dynamically set stroke and fill based on the provided textColorClass
  const iconColor = textColorClass === "text-white" ? "#FFF" : "#000";

  return <ShieldCheckIcon className="size-5" />;
};

export const UserPlus: React.FC<LockIconProps> = ({
  textColorClass = "text-black",
}) => {
  // ✅ Dynamically set stroke and fill based on the provided textColorClass
  const iconColor = textColorClass === "text-white" ? "#FFF" : "#000";

  return <UserPlusIcon className="size-5" />;
};

export const User: React.FC<LockIconProps> = ({
  textColorClass = "text-black",
}) => {
  // ✅ Dynamically set stroke and fill based on the provided textColorClass
  const iconColor = textColorClass === "text-white" ? "#FFF" : "#000";

  return <UserIcon className="size-5" />;
};

export const Info: React.FC<LockIconProps> = ({
  textColorClass = "text-black",
}) => {
  // ✅ Dynamically set stroke and fill based on the provided textColorClass
  const iconColor = textColorClass === "text-white" ? "#FFF" : "#000";

  return <IdentificationIcon className="size-5" />;
};

export const Plus: React.FC<LockIconProps> = ({
  textColorClass = "text-black",
}) => {
  // ✅ Dynamically set stroke and fill based on the provided textColorClass
  const iconColor = textColorClass === "text-white" ? "#FFF" : "#000";

  return <PlusIcon className="size-5" />;
};

export const Scholarship: React.FC<LockIconProps> = ({
  textColorClass = "text-black",
}) => {
  // ✅ Dynamically set stroke and fill based on the provided textColorClass
  const iconColor = textColorClass === "text-white" ? "#FFF" : "#000";

  return <AcademicCapIcon className="size-5" />;
};

export const SadFace: React.FC<LockIconProps> = ({
  textColorClass = "text-black",
}) => {
  // ✅ Dynamically set stroke and fill based on the provided textColorClass
  const iconColor = textColorClass === "text-white" ? "#FFF" : "#000";

  return <FaceFrownIcon className="size-5" />;
};

export const TrashCan: React.FC<LockIconProps> = ({
  textColorClass = "text-black",
}) => {
  // ✅ Dynamically set stroke and fill based on the provided textColorClass
  const iconColor = textColorClass === "text-white" ? "#FFF" : "#000";

  return <TrashIcon className="size-5" />;
};
