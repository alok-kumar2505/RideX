import React from "react";

const LocationSearchPanel = (props) => {
  const locations = props.suggestions || [];

  return (
    <div className="h-full pr-1 mt-6">
      {props.isLoading && (
        <p className="text-sm text-gray-500 px-1 py-2">Searching locations...</p>
      )}

      {locations.map((el, idx) => (
        <button
          type="button"
          key={el.place_id || idx}
          onClick={() => {
            props.onSuggestionSelect(el.description || "");
          }}
          className="w-full text-left flex items-start gap-3 p-3 mb-2 mt-4 rounded-xl border border-gray-200 hover:border-gray-400 active:border-black transition cursor-pointer"
        >
          <span className="bg-gray-100 h-9 w-9 rounded-full items-center flex justify-center shrink-0 mt-0.5">
            <i className="ri-map-pin-fill"></i>
          </span>

          <span className="min-w-0 flex-1">
            <h4 className="font-medium text-base leading-5 truncate">
              {el.structured_formatting?.main_text || el.description}
            </h4>
            {el.structured_formatting?.secondary_text && (
              <p className="text-sm text-gray-500 mt-0.5 truncate">
                {el.structured_formatting.secondary_text}
              </p>
            )}
          </span>

          <span className="text-gray-400 self-center">
            <i className="ri-arrow-right-s-line text-lg"></i>
          </span>
        </button>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
