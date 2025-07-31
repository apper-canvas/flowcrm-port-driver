import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import DealCard from "@/components/molecules/DealCard";
import Empty from "@/components/ui/Empty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

const PipelineBoard = ({ deals, onUpdateDeal, onAddDeal }) => {
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

const stages = [
    { name: "Prospecting", color: "from-blue-500 to-blue-600", icon: "Search" },
    { name: "Qualification", color: "from-green-500 to-green-600", icon: "CheckCircle" },
    { name: "Proposal", color: "from-yellow-500 to-yellow-600", icon: "FileText" },
    { name: "Negotiation", color: "from-orange-500 to-orange-600", icon: "MessageSquare" },
    { name: "Closed Won", color: "from-emerald-500 to-emerald-600", icon: "Trophy" },
    { name: "Closed Lost", color: "from-red-500 to-red-600", icon: "XCircle" }
  ];

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getTotalValueByStage = (stage) => {
    const stageDeals = getDealsByStage(stage);
    return stageDeals.reduce((total, deal) => total + deal.value, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    setDragOverStage(null);
    
    if (draggedDeal && draggedDeal.stage !== newStage) {
      const updatedDeal = {
        ...draggedDeal,
        stage: newStage,
        updatedAt: new Date().toISOString()
      };
      
      await onUpdateDeal(updatedDeal.Id, updatedDeal);
    }
    
    setDraggedDeal(null);
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.name);
          const totalValue = getTotalValueByStage(stage.name);
          
          return (
            <Card key={stage.name} className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <CardContent className="p-4 text-center">
                <div className={`w-14 h-14 bg-gradient-to-r ${stage.color} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <ApperIcon name={stage.icon} size={20} className="text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{stage.name}</h3>
                  <p className="text-lg font-bold text-gray-900">{stageDeals.length}</p>
                  <p className="text-xs text-gray-500 font-medium">{formatCurrency(totalValue)}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pipeline Board */}
<div className="grid grid-cols-1 lg:grid-cols-6 gap-6 min-h-[600px]">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.name);
          const isDropTarget = dragOverStage === stage.name;
          
          return (
            <div
              key={stage.name}
              className={`space-y-4 ${isDropTarget ? "bg-gradient-to-b from-primary/5 to-secondary/5 rounded-lg p-2" : ""}`}
              onDragOver={(e) => handleDragOver(e, stage.name)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.name)}
            >
              {/* Stage Header */}
              <Card className="bg-gradient-to-r from-surface to-gray-50">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-gray-700">
                      {stage.name}
                    </CardTitle>
                    <div className={`w-6 h-6 bg-gradient-to-r ${stage.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-xs">{stageDeals.length}</span>
                    </div>
                  </div>
<div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{stageDeals.length} deals</span>
                    <span className="font-semibold">{formatCurrency(getTotalValueByStage(stage.name))}</span>
                  </div>
                </CardHeader>
              </Card>

              {/* Stage Deals */}
              <div className="space-y-3 min-h-[400px]">
                {stageDeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center h-64">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3">
                      <ApperIcon name="Target" size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No deals in {stage.name.toLowerCase()}</p>
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <DealCard
                      key={deal.Id}
                      deal={deal}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedDeal?.Id === deal.Id}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineBoard;