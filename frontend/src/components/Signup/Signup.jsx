import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { FaShoePrints } from "react-icons/fa";
import axios from "axios";
import { server } from "../../server.js";
import { toast } from "react-toastify";
import styles from "../../styles/styles.js";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading status
  console.log("🚀 ~ Signup ~ email:", email, name, password, avatar);

  const handleFileInputChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request starts

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);

    try {
      const res = await axios.post(`${server}/user/create-user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      setName("");
      setEmail("");
      setPassword("");
      // setAvatar(null);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false); // Set loading to false when the request is completed
    }
  };

  return (
    <div className="min-h-screen bg-bone flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 justify-center">
          <FaShoePrints className="text-marigold text-[24px] -rotate-12" />
          <span className="font-display text-[30px] font-semibold text-espresso">
            Qadam
          </span>
        </Link>
        <h2 className="mt-6 font-display text-3xl font-semibold text-espresso">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-clay">
          Join Qadam to shop faster and follow your orders.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-sand py-8 px-4 shadow-card rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-espresso"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-espresso"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-espresso"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-espresso"
              >
                Avatar
              </label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8" />
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="ml-5 flex items-center justify-center px-4 py-2 border border-sand rounded-lg text-sm font-medium text-espresso bg-bone hover:border-marigold cursor-pointer transition-colors"
                >
                  <span>Upload a file</span>
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full h-[46px] flex justify-center items-center py-2 px-4 text-[15px] font-display font-medium rounded-xl text-bone bg-espresso hover:bg-coffee transition-colors disabled:opacity-60"
                disabled={loading} // Disable the button when loading is true
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>
            <div className="flex justify-between items-center w-full text-sm">
              <h4 className="text-clay">Already have an account?</h4>
              <Link
                to="/login"
                className="text-marigold-dark font-medium pl-2 hover:text-espresso transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
