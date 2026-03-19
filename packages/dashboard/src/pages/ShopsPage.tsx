import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHouseholdStore } from '@/stores';
import { useShops } from '@/hooks/useShops';
import { useCreateShop, useUpdateShop, useDeleteShop } from '@/hooks/mutations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShopFormDialog, DeleteShopDialog } from '@/components/shops';
import type { ShopFormData } from '@/components/shops';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Store,
  Clock,
} from 'lucide-react';
import type { ShopDocument, VisitPeriod } from '@supermarket-list/shared';

function formatLastVisited(lastVisitedAt: string | null): string {
  if (!lastVisitedAt) return 'Never';
  const date = new Date(lastVisitedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

function formatVisitPeriod(vp: VisitPeriod | null): string {
  if (!vp) return 'No reminder';
  return `Every ${vp.value} ${vp.unit}`;
}

const defaultForm: ShopFormData = {
  name: '',
  visitPeriodValue: '7',
  visitPeriodUnit: 'days',
  hasVisitPeriod: false,
};

export function ShopsPage() {
  const navigate = useNavigate();
  const activeHousehold = useHouseholdStore((s) => s.activeHousehold);
  const householdId = activeHousehold?.householdId ?? '';
  const { shops, loading } = useShops(householdId || null);

  const createMutation = useCreateShop();
  const updateMutation = useUpdateShop();
  const deleteMutation = useDeleteShop();

  const [showForm, setShowForm] = useState(false);
  const [editingShop, setEditingShop] = useState<ShopDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ShopDocument | null>(null);
  const [form, setForm] = useState<ShopFormData>(defaultForm);

  const openCreateForm = () => {
    setEditingShop(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const openEditForm = (shop: ShopDocument) => {
    setEditingShop(shop);
    setForm({
      name: shop.name,
      visitPeriodValue: shop.visitPeriod?.value.toString() ?? '7',
      visitPeriodUnit: shop.visitPeriod?.unit ?? 'days',
      hasVisitPeriod: !!shop.visitPeriod,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;

    const visitPeriod: VisitPeriod | null = form.hasVisitPeriod
      ? { value: parseInt(form.visitPeriodValue) || 7, unit: form.visitPeriodUnit }
      : null;

    if (editingShop) {
      await updateMutation.mutateAsync({
        householdId,
        shopId: editingShop.shopId,
        name: form.name.trim(),
        visitPeriod,
      });
    } else {
      await createMutation.mutateAsync({
        householdId,
        name: form.name.trim(),
        visitPeriod,
      });
    }

    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync({
      householdId,
      shopId: deleteTarget.shopId,
    });
    setDeleteTarget(null);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-bold text-lg">Shops</h1>
          </div>
          <Button size="sm" onClick={openCreateForm}>
            <Plus className="mr-1 h-4 w-4" />
            Add Shop
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <Store className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No shops yet</h2>
            <p className="text-muted-foreground mb-6">
              Add shops to group your items and track visits
            </p>
            <Button onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Shop
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {shops.map((shop) => (
              <Card key={shop.shopId}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{shop.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatVisitPeriod(shop.visitPeriod)}
                        </span>
                        <Separator orientation="vertical" className="h-4" />
                        <span>Last: {formatLastVisited(shop.lastVisitedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditForm(shop)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleteTarget(shop)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <ShopFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        form={form}
        onFormChange={setForm}
        isEditing={!!editingShop}
        isSaving={isSaving}
        onSubmit={handleSubmit}
      />

      <DeleteShopDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        shopName={deleteTarget?.name ?? ''}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
