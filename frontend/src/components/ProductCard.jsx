const ProductCard = ({ product }) => {
    return (
      <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
        <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-2" />
        <h3 className="text-lg font-bold">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.description}</p>
      </div>
    );
  };
  
  export default ProductCard;
  