// src/components/DashboardFooter.tsx
const DashboardFooter = () => {
    return (
      <div className="bg-gray-100 p-4 text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Defined Recipe. All rights reserved.
        </p>
      </div>
    );
  };
  
  export default DashboardFooter;
  