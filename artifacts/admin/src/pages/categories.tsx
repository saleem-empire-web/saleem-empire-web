import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api, type AdminCategory } from "@/lib/api";
import CategoryDialog from "@/components/CategoryDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<AdminCategory | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const load = () => {
    setLoading(true);
    api.getCategories().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async () => {
    if (deleteId == null) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await api.deleteCategory(deleteId);
      load();
      setDeleteId(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الفئات</h1>
          <p className="text-muted-foreground text-sm mt-1">{categories.length} فئات</p>
        </div>
        <Button onClick={() => { setEditCategory(null); setDialogOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> إضافة فئة
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg h-40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-card border border-border rounded-lg overflow-hidden group">
              <div className="relative h-36">
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 right-3 left-3">
                  <h3 className="font-bold text-white text-base">{cat.nameAr}</h3>
                  <p className="text-white/70 text-xs">{cat.name}</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {cat.productCount} منتج
                </Badge>
                <div className="flex gap-1">
                  <Button
                    size="sm" variant="ghost"
                    onClick={() => { setEditCategory(cat); setDialogOpen(true); }}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm" variant="ghost"
                    onClick={() => { setDeleteId(cat.id); setDeleteError(""); }}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={cat.productCount > 0}
                    title={cat.productCount > 0 ? "لا يمكن الحذف — يحتوي على منتجات" : ""}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        category={editCategory}
        onSaved={load}
      />

      <AlertDialog open={deleteId != null} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الفئة</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذه الفئة؟</AlertDialogDescription>
            {deleteError && <p className="text-sm text-destructive mt-1">{deleteError}</p>}
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse sm:flex-row-reverse">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
