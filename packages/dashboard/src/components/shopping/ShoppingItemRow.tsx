import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, Check } from 'lucide-react';
import type { ShoppingItemDocument } from '@supermarket-list/shared';
import { ShoppingItemAmountTrigger } from './ShoppingItemAmountTrigger';
import { ShoppingItemQuantityDialog } from './ShoppingItemQuantityDialog';

interface ShoppingItemRowProps {
  item: ShoppingItemDocument;
  onComplete: (itemId: string) => void;
  onUncomplete: (itemId: string) => void;
  onEdit: (item: ShoppingItemDocument) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  isToggling?: boolean;
  disabled?: boolean;
}

export function ShoppingItemRow({
  item,
  onComplete,
  onUncomplete,
  onEdit,
  onUpdateQuantity,
  isToggling,
  disabled,
}: ShoppingItemRowProps) {
  const [qtyEditorOpen, setQtyEditorOpen] = useState(false);

  const commitQuantity = useCallback(
    (q: number) => onUpdateQuantity(item.itemId, q),
    [item.itemId, onUpdateQuantity]
  );

  const quantityLabel = [
    item.quantity != null ? String(item.quantity) : null,
    item.unit,
  ]
    .filter(Boolean)
    .join(' ');

  const handleToggle = () => {
    if (isToggling || disabled) return;
    item.completed ? onUncomplete(item.itemId) : onComplete(item.itemId);
  };

  return (
    <div className="flex items-center min-h-[56px] py-2 pl-4 pr-3 gap-2">
      {/* Checkbox */}
      <button
        type="button"
        className="shrink-0 active:scale-95 transition-transform"
        onClick={handleToggle}
        disabled={isToggling || disabled}
      >
        <div
          className="flex items-center justify-center h-7 w-7 rounded-full border-2 border-primary/40 transition-colors data-[checked=true]:bg-primary data-[checked=true]:border-primary"
          data-checked={item.completed}
        >
          {isToggling ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : item.completed ? (
            <Check className="h-4 w-4 text-primary-foreground" />
          ) : null}
        </div>
      </button>

      {/* Name + badges — tapping also toggles completion */}
      <button
        type="button"
        className="flex-1 min-w-0 text-left active:opacity-70 transition-opacity"
        onClick={handleToggle}
        disabled={isToggling || disabled}
      >
        <div className="flex items-center gap-2">
          <span
            className={`font-medium truncate ${
              item.completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {item.name}
          </span>
          {item.completed && quantityLabel && (
            <span className="text-sm text-muted-foreground shrink-0">
              {quantityLabel}
            </span>
          )}
        </div>
        {item.brand && (
          <span className="text-xs text-muted-foreground truncate">
            {item.brand}
          </span>
        )}
      </button>

      {!item.completed && (
        <>
          <ShoppingItemAmountTrigger
            quantity={item.quantity ?? 1}
            unit={item.unit}
            disabled={disabled}
            onOpenDialog={() => setQtyEditorOpen(true)}
            onAdjustQuantity={commitQuantity}
          />

          <ShoppingItemQuantityDialog
            open={qtyEditorOpen}
            onOpenChange={setQtyEditorOpen}
            itemName={item.name}
            unit={item.unit}
            quantity={item.quantity ?? 1}
            disabled={disabled}
            onSave={commitQuantity}
          />
        </>
      )}

      {/* Edit button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 shrink-0"
        onClick={() => onEdit(item)}
        disabled={disabled}
      >
        <Pencil className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
