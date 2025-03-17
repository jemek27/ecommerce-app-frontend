
import { Product } from "@/types/Product";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

const ProductCard = ({ product, onEdit, onDelete, onView }: ProductCardProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      onDelete(product.id!);
      toast({
        title: "Product deleted",
        description: `${product.name} has been removed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold cursor-pointer hover:text-primary truncate" onClick={() => onView(product.id!)}>
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-xl font-bold text-primary mb-2">
          ${product.price.toFixed(2)}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
