import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { createProduct } from "../../redux/actions/product";
import { toast } from "react-toastify";
const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  // console.log(success)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("Unisex");
  const [material, setMaterial] = useState("");
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");

  // clear any stale success/error flag when the page opens
  useEffect(() => {
    dispatch({ type: "clearMessages" });
    dispatch({ type: "clearErrors" });
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (success) {
      toast.success("Product created successfully");
      dispatch({ type: "clearMessages" });
      navigate("/dashboard-products");
    }
  }, [dispatch, error, success, navigate]);
  const handleImageChange = (e) => {
    e.preventDefault();
    let files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const newForm = new FormData();

    // Append values outside the loop
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("brand", brand);
    newForm.append("gender", gender);
    newForm.append("material", material);
    newForm.append("sizes", sizes); // comma-separated; backend splits into an array
    newForm.append("colors", colors);
    newForm.append("shopId", seller._id);

    // Append images in the loop
    images.forEach((image) => {
      newForm.append("images", image);
    });

    dispatch(createProduct(newForm));
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white border border-sand shadow-card rounded-2xl p-5 overflow-y-scroll">
      <h5 className="text-[26px] font-display font-semibold text-espresso text-center">Create Products</h5>
      {/* create product form */}
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-sand rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-marigold focus:border-marigold sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-sand rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-marigold focus:border-marigold sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border border-sand focus:border-marigold h-[40px] rounded-lg transition-colors"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Choose a category</option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Tags <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-sand rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-marigold focus:border-marigold sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Brand</label>
          <input
            type="text"
            name="brand"
            value={brand}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-sand rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-marigold focus:border-marigold sm:text-sm"
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Qadam"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">For</label>
          <select
            className="w-full mt-2 border border-sand focus:border-marigold h-[40px] rounded-lg transition-colors"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="Unisex">Unisex</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Material</label>
          <input
            type="text"
            name="material"
            value={material}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-sand rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-marigold focus:border-marigold sm:text-sm"
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="e.g. Genuine Leather"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Available sizes (UK)</label>
          <input
            type="text"
            name="sizes"
            value={sizes}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-sand rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-marigold focus:border-marigold sm:text-sm"
            onChange={(e) => setSizes(e.target.value)}
            placeholder="Comma separated, e.g. 6,7,8,9,10"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Colours</label>
          <input
            type="text"
            name="colors"
            value={colors}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-sand rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-marigold focus:border-marigold sm:text-sm"
            onChange={(e) => setColors(e.target.value)}
            placeholder="Comma separated, e.g. Black, Tan"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-sand rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-marigold focus:border-marigold sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product price..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-sand rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-marigold focus:border-marigold sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your product price with discount..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-sand rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-marigold focus:border-marigold sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((i) => (
                <img
                  src={URL.createObjectURL(i)}
                  key={i}
                  className="h-[120px] w-[120px] object-cover m-2"
                  alt=""
                />
              ))}
          </div>
          <br />
          <div>
            <input
              type="submit"
              value="Create"
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-sand rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-marigold focus:border-marigold sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
