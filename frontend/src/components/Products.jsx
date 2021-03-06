import numeral from "numeral";
import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

function Products(props) {
  const { product } = props;
  return (
    <div className="card">
      <Link to={`/product/${product._id}`}>
        <img src={product.imageAlbum.image1} alt="product" className="medium" />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <h2>{product.name}</h2>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <div className="row">
          <div className="price">
            ${numeral(product.price).format("0,0.00")}
          </div>
          <div>
            <Link to={`/seller/${product.seller._id}`}>
              <strong>{product.seller.seller?.business}</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
