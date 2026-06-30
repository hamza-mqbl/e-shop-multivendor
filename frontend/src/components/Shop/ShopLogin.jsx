import React, { useState } from "react";
import styles from "../../styles/styles.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server.js";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaShoePrints } from "react-icons/fa";

export const ShopLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `${server}/shop/login-shop`,
        { email, password },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Login Success!");
        navigate("/dashboard");
        window.location.reload(true);
      })
      .catch((err) => {
        if (err.response) toast.error(err.response.data.message);
      });
  };

  return (
    <div className="min-h-screen bg-bone flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 justify-center">
          <FaShoePrints className="text-marigold text-[24px] -rotate-12" />
          <span className="font-display text-[30px] font-semibold text-espresso">
            Qadam
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-clay border border-sand rounded px-1.5 py-0.5">
            Seller
          </span>
        </Link>
        <h2 className="mt-6 font-display text-3xl font-semibold text-espresso">
          Seller sign in
        </h2>
        <p className="mt-2 text-sm text-clay">
          Manage your shop, products and orders.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-sand py-8 px-4 shadow-card rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-espresso">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-espresso">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-3 top-2.5 cursor-pointer text-clay"
                    size={22}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-3 top-2.5 cursor-pointer text-clay"
                    size={22}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>

            <div className={`${styles.noramlFlex} justify-between`}>
              <div className={`${styles.noramlFlex}`}>
                <input
                  type="checkbox"
                  id="remember-me"
                  className="h-4 w-4 accent-marigold border-sand rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-espresso"
                >
                  Remember me
                </label>
              </div>
              <a
                href=".forgot-password"
                className="text-sm font-medium text-marigold-dark hover:text-espresso transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full h-[46px] flex justify-center items-center text-[15px] font-display font-medium rounded-xl text-bone bg-espresso hover:bg-coffee transition-colors"
            >
              Sign in
            </button>
            <div className={`${styles.noramlFlex} w-full text-sm`}>
              <h4 className="text-clay">Don't have a shop yet?</h4>
              <Link
                to="/shop-create"
                className="text-marigold-dark font-medium pl-2 hover:text-espresso transition-colors"
              >
                Create one
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopLogin;
