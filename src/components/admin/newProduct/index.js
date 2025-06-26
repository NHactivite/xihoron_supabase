"use client";
import { newProduct } from "@/action";
import React from "react";
import { useState } from "react";

const NewProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [occasion, setOccasion] = useState("");

  const [photos, setPhotos] = useState({
    file: [],
    preview: [],
    error: "",
  });

  const changeHandler = (e) => {
  const files = Array.from(e.target.files);

  const filePreviews = files.map((file) => URL.createObjectURL(file));

  setPhotos({
    file: files,
    preview: filePreviews,
    error: "",
  });
 };


const submitHandler = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const formData = new FormData();

    formData.set("name", name);
    formData.set("description", description);
    formData.set("price", price.toString());
    formData.set("stock", stock.toString());
    formData.set("category", category);
    formData.set("occasion", occasion);

    photos.file.forEach((file) => {
      formData.append("photos", file);
    });

    const res = await fetch("/api/product", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Response:", data);

    if (data.success) {
      // Success toast
    } else {
      // Error toast
    }
  } catch (err) {
    console.error("Error submitting:", err);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div>
      <main>
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                min={"0"}
                value={price === 0 ? " " : price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                min={"0"}
                value={stock === 0 ? " " : stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label>Occasion</label>
              <input
                required
                type="text"
                placeholder="Occasion Name"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
              />
            </div>
            <div>
              <label>photos</label>
              <input
                required
                accept="image/*"
                type="file"
                multiple
                onChange={changeHandler}
              />
            </div>
            {photos.error && <p>{photos.error}</p>}
            {photos.preview &&
              photos.preview.map((img, i) => (
                <img key={i} src={img} alt="New Image" />
              ))}
            <button type="submit" >
              Create
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
