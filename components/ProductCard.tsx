import React from 'react';
import { type Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex p-4 items-start space-x-4 w-full">
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-md text-gray-600 mb-3">
          <span className="font-semibold text-main-accent">${product.price.toFixed(2)}</span>
          <span className="text-gray-500"> at </span>
          <span className="font-semibold text-gray-700">{product.store.name}</span>
        </p>
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
      </div>
      <div className="flex-shrink-0">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-md bg-gray-100 border"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-100 rounded-md border flex items-center justify-center">
            <span className="text-xs text-gray-400">No Image</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;