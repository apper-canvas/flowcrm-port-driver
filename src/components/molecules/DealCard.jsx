import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent } from "@/components/atoms/Card";
import { format } from "date-fns";

const DealCard = ({ deal, onDragStart, onDragEnd, isDragging = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageVariant = (stage) => {
    const variants = {
      "Prospecting": "secondary",
      "Qualification": "success", 
      "Proposal": "warning",
      "Negotiation": "info",
      "Closed Won": "success",
      "Closed Lost": "error"
    };
    return variants[stage] || "default";
  };

  const getSalesRepName = (salesRep) => {
    const names = {
      "john_doe": "John Doe",
      "jane_smith": "Jane Smith",
      "mike_johnson": "Mike Johnson",
      "sarah_wilson": "Sarah Wilson",
      "david_brown": "David Brown"
    };
    return names[salesRep] || salesRep;
  };

  const getDaysInStage = (updatedAt) => {
    const days = Math.floor((new Date() - new Date(updatedAt)) / (1000 * 60 * 60 * 24));
    return days;
  };

  const isOverdue = (expectedCloseDate) => {
    return new Date(expectedCloseDate) < new Date();
  };

  return (
    <Card 
      className={`cursor-move transition-all duration-200 hover:scale-102 hover:shadow-lg ${
        isDragging ? "opacity-50 scale-105 rotate-2" : ""
      } bg-gradient-to-br from-white to-gray-50`}
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, deal)}
      onDragEnd={onDragEnd}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 leading-5">
              {deal.title}
            </h4>
            <ApperIcon name="GripVertical" size={16} className="text-gray-400 ml-2 flex-shrink-0" />
          </div>
          
          {/* Value and Probability */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {formatCurrency(deal.value)}
            </span>
            <div className="flex items-center space-x-1 text-xs">
              <div className={`w-2 h-2 rounded-full ${deal.probability >= 75 ? 'bg-green-500' : deal.probability >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className="text-gray-600 font-medium">{deal.probability}%</span>
            </div>
          </div>
          
          {/* Stage Badge */}
          <div className="flex justify-center">
            <Badge variant={getStageVariant(deal.stage)} className="text-xs px-2 py-1">
              {deal.stage}
            </Badge>
          </div>
          
          {/* Contact */}
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <ApperIcon name="User" size={12} />
            <span className="truncate font-medium">{deal.contactName}</span>
          </div>
          
          {/* Sales Rep */}
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <ApperIcon name="UserCheck" size={12} />
            <span className="truncate">{getSalesRepName(deal.salesRep)}</span>
          </div>
          
          {/* Expected Close Date */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" size={12} />
              <span className={`font-medium ${isOverdue(deal.expectedCloseDate) ? 'text-red-600' : 'text-gray-600'}`}>
                {format(new Date(deal.expectedCloseDate), "MMM d, yyyy")}
              </span>
            </div>
            {isOverdue(deal.expectedCloseDate) && (
              <Badge variant="error" className="text-xs px-1.5 py-0.5">
                Overdue
              </Badge>
            )}
          </div>
          
          {/* Days in Stage */}
          <div className="flex items-center justify-center pt-1 border-t border-gray-100">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <ApperIcon name="Clock" size={12} />
              <span>{getDaysInStage(deal.updatedAt)} days in stage</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealCard;