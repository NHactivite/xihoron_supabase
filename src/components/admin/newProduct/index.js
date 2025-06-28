"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const NewProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [occasion, setOccasion] = useState("");
  const [details, setDetails] = useState([{ key: "", value: "" }]);

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

  const removeImage = (index) => {
    const newFiles = photos.file.filter((_, i) => i !== index);
    const newPreviews = photos.preview.filter((_, i) => i !== index);

    setPhotos({
      file: newFiles,
      preview: newPreviews,
      error: "",
    });
  };

  const addDetailField = () => {
    setDetails([...details, { key: "", value: "" }]);
  };

  const removeDetailField = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails.length > 0 ? newDetails : [{ key: "", value: "" }]);
  };

  const updateDetailField = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
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

      // Convert details array to object and stringify
      const detailsObject = {};
      details.forEach((detail) => {
        if (detail.key.trim() && detail.value.trim()) {
          detailsObject[detail.key.trim()] = detail.value.trim();
        }
      });
      formData.set("details", JSON.stringify(detailsObject));

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
        toast.success("Product created!");
        setName("");
        setPrice("");
        setStock("");
        setCategory("");
        setDescription("");
        setOccasion("");
        setDetails([{ key: "", value: "" }]);
        setPhotos({ file: [], preview: [], error: "" });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error submitting:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Product Name
                </Label>
                <Input
                  id="name"
                  required
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Input
                  id="category"
                  required
                  type="text"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                required
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  required
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={price === 0 ? "" : price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-medium">
                  Stock Quantity
                </Label>
                <Input
                  id="stock"
                  required
                  type="number"
                  placeholder="0"
                  min="0"
                  value={stock === 0 ? "" : stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occasion" className="text-sm font-medium">
                  Occasion
                </Label>
                <Input
                  id="occasion"
                  required
                  type="text"
                  placeholder="Enter occasion"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Product Details</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDetailField}
                  className="text-xs bg-transparent"
                >
                  Add Detail
                </Button>
              </div>
              <div className="space-y-3">
                {details.map((detail, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Detail name (e.g., Material)"
                      value={detail.key}
                      onChange={(e) =>
                        updateDetailField(index, "key", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder="Detail value (e.g., Cotton)"
                      value={detail.value}
                      onChange={(e) =>
                        updateDetailField(index, "value", e.target.value)
                      }
                      className="flex-1"
                    />
                    {details.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeDetailField(index)}
                        className="px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Product Photos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-gray-400 transition-colors">
                <input
                  required
                  accept="image/*"
                  type="file"
                  multiple
                  onChange={changeHandler}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium text-blue-600 hover:text-blue-500">
                      Click to upload
                    </span>{" "}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                </label>
              </div>

              {photos.error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {photos.error}
                </p>
              )}

              {photos.preview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.preview.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Product preview ${i + 1}`}
                        className="w-full h-32 object-cover rounded-lg border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProduct;
