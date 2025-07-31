import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="bg-gradient-to-br from-error/10 to-error/5 rounded-full p-6 mb-6">
        <div className="bg-gradient-to-br from-error/20 to-error/10 rounded-full p-4">
          <ApperIcon name="AlertCircle" size={48} className="text-error" />
        </div>
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {message}. Don't worry, this happens sometimes. Please try again.
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
      
      <div className="mt-8 text-sm text-gray-500">
        If this problem persists, please contact support.
      </div>
    </div>
  );
};

export default Error;