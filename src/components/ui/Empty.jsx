import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.", 
  actionLabel = "Add New",
  onAction,
  icon = "Database"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full p-6 mb-6">
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full p-4">
          <ApperIcon name={icon} size={48} className="text-primary" />
        </div>
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction} 
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </Button>
      )}
      
      <div className="mt-8 space-y-2 text-sm text-gray-500">
        <p>Need help getting started?</p>
        <p>Check out our quick start guide for tips and best practices.</p>
      </div>
    </div>
  );
};

export default Empty;