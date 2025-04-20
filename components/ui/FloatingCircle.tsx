import React from "react";

export default function FloatingCircle() {
  return (
    <div className="fixed bottom-4 right-4">
      <div className="group relative">
        <div className="h-12 w-12 bg-gray-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer">
          <span className="text-white font-bold">!</span>
        </div>

        <div className="absolute bottom-14 right-0 hidden group-hover:block bg-gray-800 text-white text-sm rounded-md p-2 shadow-lg min-w-[200px]">
          <p>
            Made by:
            <br /> Khadim Diop
            <br /> Duy Nguyen
            <br /> Jaymond Baruso
          </p>
        </div>
      </div>
    </div>
  );
}
