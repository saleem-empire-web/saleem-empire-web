import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/ImageUpload";
import { api, type AdminProduct, type AdminCategory } from "@/lib/api";

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product?: AdminProduct | null;
  categories: AdminCategory[];
  onSaved: () => void;
}

const empty = {
  name: "", nameAr: "", description: "", descriptionAr: "",
  price: "", compareAtPrice: "", imageUrl: "", categoryId: "",
  featured: false, inStock: true, quantity: "0",
};

export default function ProductDialog({ open, onClose, product, categories, onSaved }: ProductDialogProps) {
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        nameAr: product.nameAr,
        description: product.description,
        descriptionAr: product.descriptionAr,
        price: String(product.price),
        compareAtPrice: product.compareAtPrice ?? "",
        imageUrl: product.imageUrl,
        categoryId: String(product.categoryId),
        featured: product.featured,
        inStock: product.inStock,
        quantity: String(product.quantity ?? 0),
      });
    } else {
      setForm({ ...empty });
    }
    setError("");
  }, [product, open]);

  const set = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.nameAr || !form.price || !form.imageUrl || !form.categoryId) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name, nameAr: form.nameAr,
        description: form.description, descriptionAr: form.descriptionAr,
        price: form.price,
        compareAtPrice: form.compareAtPrice || null,
        imageUrl: form.imageUrl,
        categoryId: Number(form.categoryId),
        featured: form.featured,
        inStock: form.inStock,
        quantity: Number(form.quantity),
      };
      if (product) {
        await api.updateProduct(product.id, payload);
      } else {
        await api.createProduct(payload as Parameters<typeof api.createProduct>[0]);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>{product ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>الاسم (English) *</Label>
              <Input dir="ltr" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Product name" />
            </div>
            <div className="space-y-1.5">
              <Label>الاسم (عربي) *</Label>
              <Input value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} placeholder="اسم المنتج" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>الوصف (English)</Label>
              <Textarea dir="ltr" value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Product description" />
            </div>
            <div className="space-y-1.5">
              <Label>الوصف (عربي)</Label>
              <Textarea value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} rows={3} placeholder="وصف المنتج" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>السعر ($) *</Label>
              <Input dir="ltr" type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <Label>السعر قبل الخصم ($)</Label>
              <Input dir="ltr" type="number" step="0.01" min="0" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <Label>الكمية</Label>
              <Input dir="ltr" type="number" min="0" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="0" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>الفئة *</Label>
            <Select value={form.categoryId} onValueChange={(v) => set("categoryId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.nameAr} / {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>صورة المنتج *</Label>
            <ImageUpload value={form.imageUrl} onChange={(url) => set("imageUrl", url)} />
          </div>

          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <Switch id="inStock" checked={form.inStock} onCheckedChange={(v) => set("inStock", v)} />
              <Label htmlFor="inStock">متاح في المخزن</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="featured" checked={form.featured} onCheckedChange={(v) => set("featured", v)} />
              <Label htmlFor="featured">منتج مميز</Label>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="flex gap-2 justify-start pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "جاري الحفظ..." : product ? "حفظ التعديلات" : "إضافة المنتج"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
