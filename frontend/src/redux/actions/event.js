// create event

import axios from "axios";
import { server } from "../../server";

export const createevent = (newForm) => async (dispatch) => {
  console.log("🚀 ~ createevent ~ newForm:", newForm)
  try {
    dispatch({
      type: "eventCreateRequest",
    });
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.post(
      `${server}/event/create-event`,
      newForm,
      config
    );
    dispatch({
      type: "eventCreateSuccess",
      payload: data.event,
    });
  } catch (error) {
    dispatch({
      type: "eventCreateFail",
      payload: error.response.data.message,
    });
  }
};

// get all events
export const getAlleventsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsShopRequest",
    });
    const { data } = await axios.get(
      `${server}/event/get-all-events-shop/${id}`
    );
    dispatch({
      type: "getAlleventsShopSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAlleventsShopFail",
      payload: error.response.data.message,
    });
  }
};

// delete event of a shop
export const deleteevent = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteeventRequest",
    });
    const { data } = await axios.delete(
      `${server}/event/delete-shop-event/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch({
      type: "deleteeventSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteeventFail",
      payload: error.response.data.message,
    });
  }
};

// get all event

export const getAllEvent = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllEventRequest",
    });
    const { data } = await axios.get(`${server}/event/get-all-events`);
    dispatch({
      type: "getAllEventSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAllEventFailed",
      payload: error.response.data.message,
    });
  }
};
