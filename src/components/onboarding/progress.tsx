import clsx from "clsx";

const Progress = ({ percent = 0, bgColor = "" }) => {
  return (
    <div className="w-full h-2 bg-gray-300 mb-4">
      <div
        style={{ width: `${percent}%` }}
        className={clsx("h-2 transition-all rounded-r-2xl ", bgColor)}
      />
    </div>
  );
};

export default Progress;
