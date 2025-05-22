import React, { ReactElement } from "react";
import { Text } from "../../../_design/Typography";
import { getTextColorBasedOnBg } from "../../../_utility/getBorderClass";

interface TeamProfileCardsProps {
  header: string | ReactElement;
  children: React.ReactNode;
  team: any;
  classes?: string;
  backgroundColor: string;
  headerColor: string;
  darkerBackgroundColor: string;
  borderColor: string;
  textColorClass: string;
}

export const TeamProfileCards: React.FC<TeamProfileCardsProps> = ({
  header,
  children,
  team,
  classes = "bg-[#1f2937]",
  backgroundColor,
  headerColor,
  darkerBackgroundColor,
  textColorClass,
  borderColor,
}) => {
  const headerTextColorClass = getTextColorBasedOnBg(headerColor);

  return (
    <div
      className={`flex flex-col rounded-lg p-4 w-full md:max-w-[50em] h-full shadow-md border-2 ${classes}`}
      style={{ borderColor: headerColor, backgroundColor }}
    >
      <div
        className="mb-4 rounded-md"
        style={{ backgroundColor: headerColor, borderColor: headerColor }}
      >
        <Text
          variant="h4"
          className={`font-semibold rounded-md py-1 px-1 ${headerTextColorClass}`}
        >
          {header}
        </Text>
      </div>
      <div className="flex flex-col overflow-auto h-full">
        {React.Children.map(children, (child, index) => (
          <div
            className={
              index % 2 === 0 ? "border-t-2 pt-0.5" : "border-t-2 pt-0.5"
            }
            style={{
              backgroundColor:
                index % 2 === 0 ? "transparent" : darkerBackgroundColor,
              borderColor,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};