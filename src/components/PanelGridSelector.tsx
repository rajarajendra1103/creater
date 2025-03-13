
import { Grid2X2, Grid3X3, LayoutHorizontal, LayoutVertical, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PanelGridSelectorProps {
  selectedLayout: string;
  onSelectLayout: (layout: string) => void;
}

const PanelGridSelector = ({ selectedLayout, onSelectLayout }: PanelGridSelectorProps) => {
  const layouts = [
    { id: '2x2', icon: <Grid2X2 size={18} />, label: '2×2 Grid' },
    { id: '3x3', icon: <Grid3X3 size={18} />, label: '3×3 Grid' },
    { id: '1x3', icon: <LayoutVertical size={18} />, label: 'Vertical' },
    { id: '3x1', icon: <LayoutHorizontal size={18} />, label: 'Horizontal' },
    { id: 'custom', icon: <Settings size={18} />, label: 'Custom' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {layouts.map((layout) => (
        <Button
          key={layout.id}
          variant={selectedLayout === layout.id ? "default" : "outline"}
          onClick={() => onSelectLayout(layout.id)}
          className="flex-1"
          size="sm"
        >
          {layout.icon}
          <span className="ml-1 hidden sm:inline">{layout.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default PanelGridSelector;
