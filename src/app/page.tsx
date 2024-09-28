import React from "react";
import DropzoneImageUploader from "@/components/tensor";
import { ModeToggle } from "@/components/theme-toggle";

function Home() {
  return (
    <section>
      <nav className="bg-black p-4 mb-12">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold">SnapSense</div>
          <ModeToggle />
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <DropzoneImageUploader />
      </div>
    </section>
  );
}

export default Home;
