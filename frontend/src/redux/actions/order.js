import axios from "axios";
import { server } from "../../server";

// get all orders of a user

export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  console.log("🚀 ~ getAllOrdersOfUser ~ userId:", userId)
  try {
    dispatch({
      type: "getAllOrderUserRequest",
    });
    const { data } = await axios.get(
      `${server}/order/get-all-orders/${userId}`
    );
    dispatch({
      type: "getAllOrderUserSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrderUserFail",
      payload: error.response.data.message,
    });
  }
};

export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
    console.log("🚀 ~ getAllOrdersOfShop ~ shopId:", shopId)
    try {
      dispatch({
        type: "getAllOrderShopRequest",
      });
      const { data } = await axios.get(
        `${server}/order/get-seller-all-orders/${shopId}`
      );
      console.log("🚀 ~ getAllOrdersOfShop ~ data:", data)
      dispatch({
        type: "getAllOrderShopSuccess",
        payload: data.orders,
      });
    } catch (error) {
      dispatch({
        type: "getAllOrderShopFail",
        payload: error.response.data.message,
      });
    }
  };
  