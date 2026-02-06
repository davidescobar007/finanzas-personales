import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="md:hidden fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full shadow-2xl shadow-indigo-500/40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 border-4 border-white transition-all duration-300 hover:scale-110 active:scale-95"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export { FloatingActionButton };
