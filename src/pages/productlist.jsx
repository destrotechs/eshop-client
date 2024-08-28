import React, { useEffect,useState } from 'react';
import ProductCard from './productCard';
import apiClient from '../auth/apiClient';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../assets/breadCrump';
const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};

const ProductList = () => {
    const {category_code} = useParams();
    const {common_name} = useParams();
    const [products, setProducts] = useState([]);
    const breadcrumbPaths = [
      { label: 'Home', href: '/' },
      { label: 'Products' }
    ];
    
    useEffect (() => {
        fetchProducts();

    }, []);
console.log("search",common_name);
    const fetchProducts = async () => {
        const response = await apiClient.get('/api/products');
        if (response.status === 200) {
            setProducts(response.data.data);

        } else {    
        setProducts([]);
        }
    }
    // const productChunks = chunkArray(category_code
    //     ? products.filter(product => product.category.category_code === category_code)
    //     : products, 4);
    const productChunks = Array(
      products.filter(product => {
        if (common_name && !category_code) {
          // Filter by common_name if it exists and category_code does not
          return product.name?.toLowerCase().includes(common_name?.toLowerCase());
        } else if (!common_name && category_code) {
          // Filter by category_code if it exists and common_name does not
          return product.category.category_code === category_code;
        } else if (common_name && category_code) {
          // Filter by both if both exist
          return product.category?.category_code === category_code &&
                 product.name?.toLowerCase().includes(common_name?.toLowerCase());
        } else {
          // No filters, return all products
          return true;
        }
      })
    );
    
        return (
          <>
          
          <Breadcrumb paths={breadcrumbPaths} />
            <div className="flex flex-col items-center w-full">
              {productChunks.length > 0 ? (
                productChunks.map((chunk, rowIndex) => (
                  <div key={rowIndex} className="flex flex-wrap justify-center gap-4 mb-8">
                    {chunk.length > 0 ? (
                      chunk.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))
                    ) : (
                      <p className="text-center w-full">No items found</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex justify-content-center bg-light-500 text-dark text-sm font-bold px-4 py-3 my-5" role="alert">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                    <p>No products found.</p>
                </div>
              )}
            </div>
            </>
          );
          
};

export default ProductList;
