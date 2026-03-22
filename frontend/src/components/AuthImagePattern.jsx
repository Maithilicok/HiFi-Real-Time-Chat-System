const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="flex items-center justify-center bg-base-200 p-12 h-full">
      
      <div className="max-w-md text-center">
        
        {/* GRID */}
        <div className="grid grid-cols-3 gap-5 mb-12 justify-center">
  {[...Array(9)].map((_, i) => (
    <div
      key={i}
      className={`w-20 h-20 rounded-3xl 
      ${i % 2 === 0 
        ? "bg-white/30" 
        : "bg-white/10"} 
      backdrop-blur-sm
      hover:scale-105
      transition-all duration-300`}
    />
  ))}
</div>
        {/* TEXT */}
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-base-content/60 mt-2">
          {subtitle}
        </p>

      </div>
    </div>
  );
};

export default AuthImagePattern;