
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/Product";
import { ProductService } from "@/services/ProductService";
import ProductCard from "./ProductCard";
import ProductSearch from "./ProductSearch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductListProps {
  onAddNew: () => void;
  onEdit: (product: Product) => void;
  onView: (id: number) => void;
}

const ProductList = ({ onAddNew, onEdit, onView }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleDelete = async (id: number) => {
    try {
      await ProductService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      setFilteredProducts(filteredProducts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      <ProductSearch onSearch={handleSearch} />

      {loading ? (
        <div className="product-grid">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="h-[200px]">
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              {searchQuery ? (
                <div>
                  <p className="text-xl font-semibold">No products match your search</p>
                  <p className="text-muted-foreground mt-2">
                    Try a different search term or clear your search
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xl font-semibold">No products found</p>
                  <p className="text-muted-foreground mt-2">
                    Add your first product to get started
                  </p>
                  <Button className="mt-4" onClick={onAddNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                  onView={onView}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;

// Helper component for skeleton loading
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card rounded-lg border shadow-sm ${className || ""}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className || ""}`}>{children}</div>
);
