import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db, productsTable, categoriesTable } from "@workspace/db";

const router: IRouter = Router();

const uploadsDir = path.resolve(process.cwd(), "../../artifacts/smoke-shop/public/images/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `upload-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

router.post("/admin/upload", upload.single("image"), (req, res): void => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const imageUrl = `/images/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [totalProducts] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable);
  const [totalCategories] = await db.select({ count: sql<number>`count(*)::int` }).from(categoriesTable);
  const [inStock] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.inStock, true));
  const [outOfStock] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.inStock, false));
  const [featured] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.featured, true));
  res.json({
    totalProducts: totalProducts?.count ?? 0,
    totalCategories: totalCategories?.count ?? 0,
    inStock: inStock?.count ?? 0,
    outOfStock: outOfStock?.count ?? 0,
    featured: featured?.count ?? 0,
  });
});

router.get("/admin/products", async (_req, res): Promise<void> => {
  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      nameAr: productsTable.nameAr,
      description: productsTable.description,
      descriptionAr: productsTable.descriptionAr,
      price: productsTable.price,
      compareAtPrice: productsTable.compareAtPrice,
      imageUrl: productsTable.imageUrl,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      categoryNameAr: categoriesTable.nameAr,
      featured: productsTable.featured,
      inStock: productsTable.inStock,
      quantity: productsTable.quantity,
      rating: productsTable.rating,
      reviewCount: productsTable.reviewCount,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .orderBy(desc(productsTable.createdAt));
  res.json(products);
});

router.post("/admin/products", async (req, res): Promise<void> => {
  const { name, nameAr, description, descriptionAr, price, compareAtPrice, imageUrl, categoryId, featured, inStock, quantity } = req.body;
  if (!name || !nameAr || !description || !descriptionAr || !price || !imageUrl || !categoryId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [product] = await db.insert(productsTable).values({
    name,
    nameAr,
    description,
    descriptionAr,
    price: String(price),
    compareAtPrice: compareAtPrice ? String(compareAtPrice) : null,
    imageUrl,
    categoryId: Number(categoryId),
    featured: featured === true || featured === "true",
    inStock: inStock !== false && inStock !== "false",
    quantity: Number(quantity ?? 0),
  }).returning();
  res.status(201).json(product);
});

router.put("/admin/products/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { name, nameAr, description, descriptionAr, price, compareAtPrice, imageUrl, categoryId, featured, inStock, quantity } = req.body;
  const [product] = await db.update(productsTable)
    .set({
      ...(name && { name }),
      ...(nameAr && { nameAr }),
      ...(description && { description }),
      ...(descriptionAr && { descriptionAr }),
      ...(price != null && { price: String(price) }),
      ...(imageUrl && { imageUrl }),
      ...(categoryId != null && { categoryId: Number(categoryId) }),
      ...(featured !== undefined && { featured: featured === true || featured === "true" }),
      ...(inStock !== undefined && { inStock: inStock === true || inStock === "true" }),
      ...(quantity != null && { quantity: Number(quantity) }),
      compareAtPrice: compareAtPrice != null && compareAtPrice !== "" ? String(compareAtPrice) : null,
    })
    .where(eq(productsTable.id, id))
    .returning();
  if (!product) { res.status(404).json({ error: "Product not found" }); return; }
  res.json(product);
});

router.delete("/admin/products/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.json({ success: true });
});

router.get("/admin/categories", async (_req, res): Promise<void> => {
  const categories = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      nameAr: categoriesTable.nameAr,
      description: categoriesTable.description,
      descriptionAr: categoriesTable.descriptionAr,
      imageUrl: categoriesTable.imageUrl,
      productCount: sql<number>`count(${productsTable.id})::int`,
    })
    .from(categoriesTable)
    .leftJoin(productsTable, eq(categoriesTable.id, productsTable.categoryId))
    .groupBy(categoriesTable.id)
    .orderBy(categoriesTable.id);
  res.json(categories);
});

router.post("/admin/categories", async (req, res): Promise<void> => {
  const { name, nameAr, description, descriptionAr, imageUrl } = req.body;
  if (!name || !nameAr || !description || !descriptionAr || !imageUrl) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [category] = await db.insert(categoriesTable).values({ name, nameAr, description, descriptionAr, imageUrl }).returning();
  res.status(201).json(category);
});

router.put("/admin/categories/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { name, nameAr, description, descriptionAr, imageUrl } = req.body;
  const [category] = await db.update(categoriesTable)
    .set({
      ...(name && { name }),
      ...(nameAr && { nameAr }),
      ...(description && { description }),
      ...(descriptionAr && { descriptionAr }),
      ...(imageUrl && { imageUrl }),
    })
    .where(eq(categoriesTable.id, id))
    .returning();
  if (!category) { res.status(404).json({ error: "Category not found" }); return; }
  res.json(category);
});

router.delete("/admin/categories/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [products] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.categoryId, id));
  if (products.count > 0) {
    res.status(400).json({ error: "Cannot delete category with existing products" });
    return;
  }
  await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  res.json({ success: true });
});

export default router;
