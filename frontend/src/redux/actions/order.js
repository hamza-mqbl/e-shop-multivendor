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
