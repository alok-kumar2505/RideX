import React from "react";

const LocationSearchPanel = (props) => {
  const locations = props.suggestions || [];

  return (
    <div className="h-full pr-1 mt-6">
      {props.isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-500 px-1 py-2">
          <i className="ri-loader-4-line animate-spin text-base"></i>
          <span>Searching locations...</span>
        </div>
      )}

      {props.mapError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl mb-3 flex items-start gap-2.5 text-xs sm:text-sm">
          <i className="ri-error-warning-fill text-red-500 text-base shrink-0 mt-0.5"></i>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-red-800">Map Service Error</p>
            <p className="mt-0.5 text-red-700 break-words">{props.mapError}</p>
            {props.currentQuery && (
              <button
                type="button"
                onClick={() => props.onSuggestionSelect(props.currentQuery)}
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-medium px-2.5 py-1.5 rounded-lg cursor-pointer transition shadow-sm"
              >
                <span>Use "{props.currentQuery}" directly</span>
                <i className="ri-arrow-right-line"></i>
              </button>
            )}
          </div>
        </div>
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
