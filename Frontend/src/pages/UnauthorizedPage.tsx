import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          🚫
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don't have the required permissions to view this page. If you believe this is a mistake, please contact your administrator.
        </p>
        <Link to="/profile">
          <Button className="w-full">Back to Profile</Button>
        </Link>
      </div>
    </div>
  );
};
