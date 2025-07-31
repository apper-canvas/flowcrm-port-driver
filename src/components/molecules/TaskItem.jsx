import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status === "pending";
  const isDueToday = format(new Date(task.dueDate), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${
      task.status === "completed" 
        ? "bg-gradient-to-r from-success/5 to-green-500/5 border-success/20" 
        : isOverdue 
          ? "bg-gradient-to-r from-error/5 to-red-600/5 border-error/20"
          : "bg-gradient-to-r from-surface/30 to-white border-gray-200 hover:border-primary/30"
    }`}>
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onToggleComplete(task.Id)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            task.status === "completed"
              ? "bg-gradient-to-r from-success to-green-600 border-success text-white"
              : "border-gray-300 hover:border-primary"
          }`}
        >
          {task.status === "completed" && <ApperIcon name="Check" size={12} />}
        </button>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <h4 className={`font-medium ${
              task.status === "completed" ? "text-gray-500 line-through" : "text-gray-900"
            }`}>
              {task.title}
            </h4>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="hover:bg-gradient-to-r hover:from-secondary/10 hover:to-accent/10"
              >
                <ApperIcon name="Edit" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.Id)}
                className="hover:bg-gradient-to-r hover:from-error/10 hover:to-red-600/10 text-error"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm ${
              task.status === "completed" ? "text-gray-400" : "text-gray-600"
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Calendar" size={14} className="text-gray-400" />
                <span className={isOverdue ? "text-error font-medium" : isDueToday ? "text-warning font-medium" : "text-gray-500"}>
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                </span>
              </div>
              
              {task.contactName && (
                <div className="flex items-center space-x-1">
                  <ApperIcon name="User" size={14} className="text-gray-400" />
                  <span className="text-gray-500">{task.contactName}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={task.status === "completed" ? "success" : isOverdue ? "error" : isDueToday ? "warning" : "default"}>
                {task.status === "completed" ? "Completed" : isOverdue ? "Overdue" : isDueToday ? "Due Today" : "Pending"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;