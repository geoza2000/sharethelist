import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHouseholdStore } from '@/stores';
import { useProducts } from '@/hooks/useProducts';
import { useShops } from '@/hooks/useShops';
import { useDeleteProduct } from '@/hooks/mutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { EditProductDialog, DeleteProductDialog, AssignProductsWizard } from '@/components/products';
import {
  ArrowLeft,
  Search,
  Package,
  Pencil,
  Trash2,
  ScanBarcode,
  Wand2,
  Filter,
} from 'lucide-react';
import type { ProductDocument } from '@supermarket-list/shared';

/** Sentinel for products with no `shopId` in the store filter set. */
const UNASSIGNED_STORE_KEY = '__unassigned__';

export function ProductsPage() {
  const navigate = useNavigate();
  const activeHousehold = useHouseholdStore((s) => s.activeHousehold);
  const householdId = activeHousehold?.householdId ?? '';
  const { products, loading } = useProducts(householdId || null);
  const { shops, shopMap } = useShops(householdId || null);

  const deleteMutation = useDeleteProduct();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<ProductDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductDocument | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [storeFilterKeys, setStoreFilterKeys] = useState<Set<string> | null>(null);

  const hasUnassignedProducts = products.some((p) => !p.shopId);
  const showWizardButton = shops.length > 0 && hasUnassignedProducts;

  const allStoreFilterKeys = useMemo(() => {
    const keys = new Set(shops.map((s) => s.shopId));
    if (hasUnassignedProducts) keys.add(UNASSIGNED_STORE_KEY);
    return keys;
  }, [shops, hasUnassignedProducts]);

  const storeFilterActive = storeFilterKeys !== null;
  const canFilterByStore = allStoreFilterKeys.size > 0;

  const toggleStoreFilterKey = useCallback(
    (key: string) => {
      setStoreFilterKeys((prev) => {
        const baseline = prev ?? allStoreFilterKeys;
        const next = new Set(baseline);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        if (next.size === 0) return next;
        const isFull =
          next.size === allStoreFilterKeys.size &&
          [...allStoreFilterKeys].every((k) => next.has(k));
        return isFull ? null : next;
      });
    },
    [allStoreFilterKeys]
  );

  const resetStoreFilter = useCallback(() => setStoreFilterKeys(null), []);

  const filtered = useMemo(() => {
    let list =
      storeFilterKeys === null
        ? products
        : products.filter((p) => {
            const key = p.shopId ?? UNASSIGNED_STORE_KEY;
            return storeFilterKeys.has(key);
          });
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.barcode?.toLowerCase().includes(q)
    );
  }, [products, searchQuery, storeFilterKeys]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync({
        householdId,
        productId: deleteTarget.productId,
      });
      setDeleteTarget(null);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/15 hover:text-primary-foreground" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-display font-bold text-lg">Products</h1>
          <div className="ml-auto flex items-center gap-2">
            {showWizardButton && (
              <Button
                size="sm"
                className="bg-white/20 text-primary-foreground hover:bg-white/30 border-0"
                onClick={() => setWizardOpen(true)}
              >
                <Wand2 className="h-4 w-4 mr-1.5" />
                Assign
              </Button>
            )}
            <Badge variant="secondary" className="text-xs bg-white/20 text-primary-foreground border-0">
              {products.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="sticky top-[57px] z-10 bg-background border-b px-4 py-2">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9"
              placeholder="Search by name, brand, or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant={storeFilterActive ? 'secondary' : 'outline'}
                size="icon"
                className="shrink-0"
                disabled={!canFilterByStore}
                aria-label="Filter by store"
                title="Filter by store"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[90vh] flex flex-col rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Filter by store</SheetTitle>
                <SheetDescription>
                  Show products for the stores you choose. Unassigned products can be included when
                  applicable.
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="flex-1 max-h-[min(50vh,24rem)] my-4 -mx-2 px-2">
                <div className="space-y-3 pr-4">
                  {shops.map((shop) => (
                    <label
                      key={shop.shopId}
                      className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5 cursor-pointer active:bg-muted/50"
                    >
                      <Checkbox
                        checked={
                          storeFilterKeys === null || storeFilterKeys.has(shop.shopId)
                        }
                        onCheckedChange={() => toggleStoreFilterKey(shop.shopId)}
                      />
                      <span className="text-sm font-medium leading-none">{shop.name}</span>
                    </label>
                  ))}
                  {hasUnassignedProducts && (
                    <label className="flex items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2.5 cursor-pointer active:bg-muted/50">
                      <Checkbox
                        checked={
                          storeFilterKeys === null ||
                          storeFilterKeys.has(UNASSIGNED_STORE_KEY)
                        }
                        onCheckedChange={() => toggleStoreFilterKey(UNASSIGNED_STORE_KEY)}
                      />
                      <span className="text-sm font-medium leading-none">Unassigned</span>
                    </label>
                  )}
                </div>
              </ScrollArea>
              <SheetFooter className="gap-2 sm:flex-col">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={resetStoreFilter}
                >
                  Show all stores
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {searchQuery
                ? 'No matches'
                : storeFilterActive
                  ? 'No products for these stores'
                  : 'No products yet'}
            </h2>
            <p className="text-muted-foreground">
              {searchQuery
                ? 'Try a different search term'
                : storeFilterActive
                  ? 'Change the store filter or show all stores'
                  : 'Products are created automatically when you add items to your list'}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((product) => {
              const shop = product.shopId ? shopMap[product.shopId] : null;
              const qty = [
                product.defaultQuantity != null ? String(product.defaultQuantity) : null,
                product.unit,
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <div
                  key={product.productId}
                  className="flex items-center py-3 px-4 gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{product.name}</span>
                      {product.brand && (
                        <span className="text-sm text-muted-foreground truncate">
                          {product.brand}
                        </span>
                      )}
                      {qty && (
                        <span className="text-sm text-muted-foreground shrink-0">
                          {qty}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      {shop && (
                        <Badge variant="outline" className="text-xs">
                          {shop.name}
                        </Badge>
                      )}
                      {product.barcode && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <ScanBarcode className="h-3 w-3" />
                          {product.barcode}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setDeleteTarget(product)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <EditProductDialog
        open={!!editingProduct}
        onOpenChange={(open) => { if (!open) setEditingProduct(null); }}
        product={editingProduct}
        householdId={householdId}
        shops={shops}
      />

      <DeleteProductDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        productName={deleteTarget?.name ?? ''}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

      <AssignProductsWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        shops={shops}
        products={products}
        householdId={householdId}
      />
    </div>
  );
}
