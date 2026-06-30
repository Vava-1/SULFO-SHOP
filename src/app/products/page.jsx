import { Suspense } from 'react';
import ProductsContent from './ProductsContent';

function ProductsLoading() {
  return (
    <div className="section py-10">
      <div className="shimmer h-8 w-48 rounded mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="shimmer aspect-square" />
            <div className="p-4 space-y-2">
              <div className="shimmer h-3 w-16 rounded" />
              <div className="shimmer h-4 w-full rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const metadata = { title: 'All Products' };

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
