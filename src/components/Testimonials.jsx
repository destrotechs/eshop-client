// Testimonials.jsx
import React from 'react';

const testimonials = [
  { name: 'Alice', review: 'Great quality products!', rating: 5 },
  { name: 'Bob', review: 'Fast shipping and excellent customer service.', rating: 4 },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-semibold text-center mb-8">What Our Customers Say</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md max-w-md">
            <p className="text-lg text-gray-700 mb-4">"{testimonial.review}"</p>
            <div className="flex items-center">
              <span className="font-semibold">{testimonial.name}</span>
              <span className="ml-2 text-yellow-500">{"★".repeat(testimonial.rating)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
