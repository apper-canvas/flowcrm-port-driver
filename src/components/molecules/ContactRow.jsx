import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const ContactRow = ({ contact, onEdit, onDelete, onViewDetails }) => {
  const getTypeVariant = (type) => {
    return type === "customer" ? "success" : "primary";
  };

  return (
    <tr className="hover:bg-gradient-to-r hover:from-surface/30 hover:to-gray-50/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-primary" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{contact.name}</div>
            <div className="text-sm text-gray-500">{contact.email}</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{contact.company}</div>
        <div className="text-sm text-gray-500">{contact.phone}</div>
      </td>
      
      <td className="px-6 py-4">
        <Badge variant={getTypeVariant(contact.type)}>
          {contact.type}
        </Badge>
      </td>
      
      <td className="px-6 py-4 text-sm text-gray-500">
        {contact.lastActivity ? format(new Date(contact.lastActivity), "MMM d, yyyy") : "No activity"}
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(contact)}
            className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10"
          >
            <ApperIcon name="Eye" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(contact)}
            className="hover:bg-gradient-to-r hover:from-secondary/10 hover:to-accent/10"
          >
            <ApperIcon name="Edit" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(contact.Id)}
            className="hover:bg-gradient-to-r hover:from-error/10 hover:to-red-600/10 text-error"
          >
            <ApperIcon name="Trash2" size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ContactRow;