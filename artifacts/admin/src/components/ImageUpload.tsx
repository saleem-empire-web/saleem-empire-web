import { useState, useRef } from "react";
import { Upload, X, Link } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await api.uploadImage(file);
      onChange(url);
      setUrlInput(url);
    } catch {
      alert("فشل رفع الصورة. حاول مرة أخرى.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Tabs defaultValue="upload">
        <TabsList className="w-full">
          <TabsTrigger value="upload" className="flex-1 gap-1.5">
            <Upload className="h-3.5 w-3.5" /> رفع صورة
          </TabsTrigger>
          <TabsTrigger value="url" className="flex-1 gap-1.5">
            <Link className="h-3.5 w-3.5" /> رابط URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-3">
          <div
            className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <p className="text-sm text-muted-foreground animate-pulse">جاري الرفع...</p>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">اضغط لاختيار صورة</p>
                <p className="text-xs text-muted-foreground/60 mt-1">PNG، JPG، WEBP — حتى 5 ميغابايت</p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
              disabled={uploading}
            />
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-3">
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://... أو /images/..."
              dir="ltr"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => onChange(urlInput)}
            >
              تطبيق
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {value && (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img src={value} alt="preview" className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={() => { onChange(""); setUrlInput(""); }}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
