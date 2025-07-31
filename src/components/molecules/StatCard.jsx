import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent } from "@/components/atoms/Card";

const StatCard = ({ title, value, icon, trend, trendValue, className = "" }) => {
  return (
    <Card className={`hover:scale-105 transition-transform duration-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
            <ApperIcon name={icon} size={20} className="text-primary" />
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-2xl font-display font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {value}
          </p>
          
          {trend && trendValue && (
            <div className="flex items-center space-x-1">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                size={14} 
                className={trend === "up" ? "text-success" : "text-error"} 
              />
              <span className={`text-sm font-medium ${trend === "up" ? "text-success" : "text-error"}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;