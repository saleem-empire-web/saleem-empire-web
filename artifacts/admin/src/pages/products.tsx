import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, CheckCircle, XCircle, Star } from "lucide-react";
import { api, type AdminProduct, type AdminCategory } from "@/lib/api";
import ProductDialog from "@/components/ProductDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([p, c]) => { setProducts(p); setCategories(c); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nameAr.includes(search) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (deleteId == null) return;
    setDeleting(true);
    try {
      await api.deleteProduct(deleteId);
      load();
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">المنتجات</h1>
          <p className="text-muted-foreground text-sm mt-1">{products.length} منتج</p>
        </div>
        <Button onClick={() => { setEditProduct(null); setDialogOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> إضافة منتج
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pr-9"
          placeholder="بحث في المنتجات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">المنتج</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">الفئة</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">السعر</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">الكمية</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">الحالة</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="px-4 py-3" colSpan={6}>
                    <div className="h-10 bg-muted/40 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-muted-foreground" colSpan={6}>
                  لا توجد منتجات
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.name} className="h-10 w-10 rounded-md object-cover border border-border" />
                      <div>
                        <p className="font-medium text-foreground">{p.nameAr}</p>
                        <p className="text-xs text-muted-foreground">{p.name}</p>
                      </div>
                      {p.featured && <Star className="h-3.5 w-3.5 text-primary fill-primary flex-shrink-0" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{p.categoryNameAr}</td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-semibold text-foreground">${Number(p.price).toFixed(2)}</span>
                      {p.compareAtPrice && (
                        <span className="text-xs text-muted-foreground line-through mr-1">
                          ${Number(p.compareAtPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-foreground">{p.quantity}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {p.inStock ? (
                      <Badge variant="outline" className="text-green-400 border-green-400/30 gap-1">
                        <CheckCircle className="h-3 w-3" /> متاح
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-400 border-red-400/30 gap-1">
                        <XCircle className="h-3 w-3" /> نفذ
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm" variant="ghost"
                        onClick={() => { setEditProduct(p); setDialogOpen(true); }}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm" variant="ghost"
                        onClick={() => setDeleteId(p.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        product={editProduct}
        categories={categories}
        onSaved={load}
      />

      <AlertDialog open={deleteId != null} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المنتج</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع.</AlertDialogDescription>
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
