
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/Product";
import { ProductService } from "@/services/ProductService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductDetail = ({ productId, onBack, onEdit, onDelete }: ProductDetailProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ProductService.getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, toast]);

  const handleDelete = async () => {
    if (!product) return;
    
    try {
      await onDelete(product.id!);
      toast({
        title: "Product deleted",
        description: `${product.name} has been removed successfully.`,
      });
      onBack();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !product) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error || "Product not found"}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl">{product.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Price</h3>
          <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
        </div>
        <div className="pt-4">
          <h3 className="text-lg font-semibold mb-1">Product ID</h3>
          <p className="text-muted-foreground">#{product.id}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => onEdit(product)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Product
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Product
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductDetail;
