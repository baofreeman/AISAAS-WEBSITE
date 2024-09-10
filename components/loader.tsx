import { LoaderPinwheel } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex pb-2 justify-center items-center">
      <LoaderPinwheel className="animate-spin" />
    </div>
  );
};

export default Loader;
