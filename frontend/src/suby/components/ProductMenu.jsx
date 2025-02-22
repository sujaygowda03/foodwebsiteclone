import React, { useState, useEffect } from "react";
import { API_URL, MAPBOX_API_KEY } from "../api";
import { useParams } from "react-router-dom";
import TopBar from "./TopBar";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const ProductMenu = () => {
  const [products, setProducts] = useState([]);
  const [area, setArea] = useState(null);

  const { firmId, firmName } = useParams();

  const productHandler = async () => {
    try {
      const response = await fetch(`${API_URL}/product/${firmId}/products`);
      const newProductData = await response.json();
      setProducts(newProductData.products);
    } catch (error) {
      console.error("product failed to fetch", error);
    }
  };

  const areaHandler = async () => {
    try {
      const response = await fetch(`${API_URL}/firm/${firmId}/area`);
      const areaData = await response.json();
      console.log("Fetched area data:", areaData); 
      setArea(areaData.area);
    } catch (error) {
      console.error("area failed to fetch", error);
    }
  };

  useEffect(() => {
    productHandler();
    areaHandler();
  }, []);

  useEffect(() => {
    if (area && area.latitude && area.longitude) {
      console.log("Initializing Mapbox with area:", area); 
      mapboxgl.accessToken = MAPBOX_API_KEY;
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [area.longitude, area.latitude],
        zoom: 12
      });

      new mapboxgl.Marker()
        .setLngLat([area.longitude, area.latitude])
        .addTo(map);

      map.on('load', () => {
        console.log("Map loaded successfully"); 
      });

      map.on('error', (e) => {
        console.error("Mapbox error:", e); 
      });
    } else {
      console.log("Area data is not complete:", area); 
    }
  }, [area]);

  return (
    <>
      <TopBar />
      <section className="productSection">
        <h3>{firmName}</h3>
        <div id="map" style={{ width: '100%', height: '400px', backgroundColor: '#e0e0e0' }}></div>
        {products.map((item) => {
          return (
            <div className="productBox" key={item.id}>
              <div>
                <div><strong>{item.productName}</strong></div>
                <div>₹{item.price}</div>
                <div>{item.description}</div>
              </div>
              <div className="productGroup">
                <img src={`${API_URL}/uploads/${item.image}`} alt={item.productName} />
                <div className="addButton">ADD</div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default ProductMenu;
