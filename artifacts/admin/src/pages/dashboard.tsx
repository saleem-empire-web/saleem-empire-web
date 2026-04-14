import { useEffect, useState } from "react";
import { Package, LayoutGrid, CheckCircle, XCircle, Star, ExternalLink } from "lucide-react";
import { api, type AdminStats } from "@/lib/api";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex items-center gap-4">
      <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-muted-foreground text-sm mt-1">نظرة عامة على المتجر</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="إجمالي المنتجات"
            value={stats.totalProducts}
            icon={<Package className="h-5 w-5 text-primary" />}
            color="bg-primary/10"
          />
          <StatCard
            label="الفئات"
            value={stats.totalCategories}
            icon={<LayoutGrid className="h-5 w-5 text-blue-400" />}
            color="bg-blue-400/10"
          />
          <StatCard
            label="متاح في المخزن"
            value={stats.inStock}
            icon={<CheckCircle className="h-5 w-5 text-green-400" />}
            color="bg-green-400/10"
          />
          <StatCard
            label="نفذ من المخزن"
            value={stats.outOfStock}
            icon={<XCircle className="h-5 w-5 text-red-400" />}
            color="bg-red-400/10"
          />
          <StatCard
            label="مميز"
            value={stats.featured}
            icon={<Star className="h-5 w-5 text-yellow-400" />}
            color="bg-yellow-400/10"
          />
        </div>
      ) : null}

      <div className="mt-8 bg-card border border-border rounded-lg p-6">
        <h2 className="text-base font-semibold text-foreground mb-3">روابط سريعة</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            فتح المتجر
          </a>
        </div>
      </div>
    </div>
  );
}
