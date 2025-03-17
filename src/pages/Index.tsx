
import { useState } from "react";
import { Product } from "@/types/Product";
import ProductList from "@/components/ProductList";
import ProductForm from "@/components/ProductForm";
import ProductDetail from "@/components/ProductDetail";

const Index = () => {
  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);

  const handleAddNew = () => {
    setSelectedProduct(undefined);
    setView("form");
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setView("form");
  };

  const handleView = (id: number) => {
    setSelectedProductId(id);
    setView("detail");
  };

  const handleFormSuccess = () => {
    setView("list");
  };

  const handleFormCancel = () => {
    setView("list");
  };

  const handleBackToList = () => {
    setView("list");
  };

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-6xl">
      {view === "list" && (
        <ProductList
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}

      {view === "form" && (
        <ProductForm
          product={selectedProduct}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {view === "detail" && selectedProductId !== undefined && (
        <ProductDetail
          productId={selectedProductId}
          onBack={handleBackToList}
          onEdit={handleEdit}
          onDelete={() => {
            // This will be called after confirmation in the ProductDetail component
            setView("list");
            return Promise.resolve();
          }}
        />
      )}
    </div>
  );
};

export default Index;
