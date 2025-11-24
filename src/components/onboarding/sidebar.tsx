/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck

import React from "react";
import Stepper from "../shared/steps";
import { brandName } from "@/constants/root";

const Sidebar = ({ steps, activeStep, onStepperChange }) => {
  return (
    <div className="hidden fixed top-0 left-0 w-64 bottom-0 bg-black p-8 md:block">
      <div className="flex items-center text-lg font-medium text-white mb-12">
        <div className="mr-2 rounded bg-white p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-black"
          >
            <path d="M3 3h18v18H3z" />
          </svg>
        </div>
        {brandName}
      </div>

      <div className="space-y-6">
        <Stepper
          steps={steps}
          activeStep={activeStep}
          handleStepperChange={onStepperChange}
        />
      </div>
    </div>
  );
};

export default Sidebar;
