import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
     dispatch(getAllOrdersOfShop(seller?._id));
     dispatch(getAllProductsShop(seller?._id));
  }, [dispatch]);

  const availableBalance = seller?.availableBalance.toFixed(2);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/shop/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders && orders.forEach((item) => {
    row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "Rs " + item.totalPrice,
        status: item.status,
      });
  });
  return (
    <div className="w-full p-8">
      <h3 className="font-display text-[20px] font-semibold text-espresso pb-3">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[31%] bg-white border border-sand shadow-card rounded-xl p-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className="font-display text-[16px] leading-5 font-medium text-clay"
            >
              Account Balance{" "}
              <span className="text-[16px]">(with 10% service charge)</span>
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] font-mono text-[24px] font-semibold text-espresso">Rs {availableBalance}</h5>
          <Link to="/dashboard-withdraw-money">
            <h5 className="pt-4 pl-[2] text-marigold-dark">Withdraw Money</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[31%] bg-white border border-sand shadow-card rounded-xl p-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className="font-display text-[16px] leading-5 font-medium text-clay"
            >
              All Orders
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] font-mono text-[24px] font-semibold text-espresso">{orders && orders.length}</h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-marigold-dark">View Orders</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[31%] bg-white border border-sand shadow-card rounded-xl p-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className="font-display text-[16px] leading-5 font-medium text-clay"
            >
              All Products
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] font-mono text-[24px] font-semibold text-espresso">{products && products.length}</h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-marigold-dark">View Products</h5>
          </Link>
        </div>
      </div>
      <br />
      <h3 className="font-display text-[20px] font-semibold text-espresso pb-3">Latest orders</h3>
      <div className="w-full min-h-[45vh] bg-white border border-sand rounded-xl overflow-hidden">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
      </div>
    </div>
  );
};

export default DashboardHero;
