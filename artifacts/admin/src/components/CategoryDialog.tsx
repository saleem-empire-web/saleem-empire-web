import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { api, type AdminCategory } from "@/lib/api";

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: AdminCategory | null;
  onSaved: () => void;
}

const empty = { name: "", nameAr: "", description: "", descriptionAr: "", imageUrl: "" };

export default function CategoryDialog({ open, onClose, category, onSaved }: CategoryDialogProps) {
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        nameAr: category.nameAr,
        description: category.description,
        descriptionAr: category.descriptionAr,
        imageUrl: category.imageUrl,
      });
    } else {
      setForm({ ...empty });
    }
    setError("");
  }, [category, open]);

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.nameAr || !form.imageUrl) {
      setError("يرجى ملء الاسم والصورة على الأقل");
      return;
    }
    setSaving(true);
    try {
      if (category) {
        await api.updateCategory(category.id, form);
      } else {
        await api.createCategory({ ...form });
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>{category ? "تعديل الفئة" : "إضافة فئة جديدة"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>الاسم (English) *</Label>
              <Input dir="ltr" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Category name" />
            </div>
            <div className="space-y-1.5">
              <Label>الاسم (عربي) *</Label>
              <Input value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} placeholder="اسم الفئة" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>الوصف (English)</Label>
              <Textarea dir="ltr" value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} placeholder="Description" />
            </div>
            <div className="space-y-1.5">
              <Label>الوصف (عربي)</Label>
              <Textarea value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} rows={2} placeholder="الوصف" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>صورة الفئة *</Label>
            <ImageUpload value={form.imageUrl} onChange={(url) => set("imageUrl", url)} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="flex gap-2 justify-start pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "جاري الحفظ..." : category ? "حفظ التعديلات" : "إضافة الفئة"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
