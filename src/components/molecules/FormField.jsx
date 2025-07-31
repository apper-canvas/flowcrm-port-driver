import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required, 
  options, 
  className,
  ...props 
}) => {
  const InputComponent = type === "select" ? Select : Input;
  
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      
      {type === "select" ? (
        <Select error={error} {...props}>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <InputComponent type={type} error={error} {...props} />
      )}
      
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;