import AddNewForm from "@/components/AddNewForm";
import Link from "next/link";
import React from "react";
import { TiArrowBackOutline } from "react-icons/ti";

const page = () => {
  return (
    <div className="w-full h-auto flex item-center p-10 md:p-20">
      <div className="w-[80%] md:w-[100%] h-auto p-4 flex rounded-xl border border-black">
        <div className="w-[80%] md:w-[100%]">
          <div className="w-full flex mb-8 justify-between">
            <div className="flex gap-2 items-center bg-gray-500 hover:bg-white hover:border hover:boreder-black text-black font-bold py-2 px-4 rounded">
              <TiArrowBackOutline size={25} />
              <Link href="/">Back</Link>
            </div>
            <h1 className="text-3xl font-bold mb-4">Add New</h1>
          </div>
          <AddNewForm />
        </div>
      </div>
    </div>
  );
};

export default page;
