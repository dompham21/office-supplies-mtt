import React from "react";


const StickerCard = ({
  titleTransKey,
  subtitleTransKey,
  icon,
  iconBgStyle,
  price,
}) => {
  return (
    <div className="flex flex-col w-full h-full p-7 rounded bg-light">
      <div className="w-full flex justify-between mb-auto pb-8">
        <div className="w-full flex flex-col">
          <span className="text-base text-heading font-semibold mb-1">
            {titleTransKey}
          </span>
          <span className="text-xs text-body font-semibold">
            {subtitleTransKey}
          </span>
        </div>

        <div
          className="w-12 h-12 rounded-full bg-gray-200 flex flex-shrink-0 items-center justify-center ms-3"
          style={iconBgStyle}
        >
          {icon}
        </div>
      </div>

      <span className="text-xl font-semibold text-heading mb-2">{price}</span>
    </div>
  );
};

export default StickerCard;
