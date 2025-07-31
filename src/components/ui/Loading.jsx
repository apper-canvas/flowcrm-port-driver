import React from "react";

const Loading = () => {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-48"></div>
        <div className="h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg w-32"></div>
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-surface/50 to-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-20"></div>
              <div className="h-8 w-8 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg"></div>
            </div>
            <div className="h-8 bg-gradient-to-r from-slate-300 to-slate-400 rounded-lg w-24 mb-2"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32"></div>
          </div>
        ))}
      </div>
      
      {/* Content area skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-surface/50 to-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-40 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                  <div className="h-10 w-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-surface/50 to-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-32 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full"></div>
                    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;