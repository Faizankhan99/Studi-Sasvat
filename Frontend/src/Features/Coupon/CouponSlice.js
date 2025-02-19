/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"

const baseURL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    coupons: [],
    responseStatus: "",
    responseMessage: "",
};

export const createCoupon = createAsyncThunk(
    "coupons/createCoupon",
    async (coupon, { rejectWithValue }) => {
        try {
            const token = Cookies.get("studioSasvatLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/coupon`, coupon, {
                headers: {
                    "x-authorization": `Bearer ${user_id}`,
                    "Content-Type": "multipart-formdata"
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getCoupons = createAsyncThunk(
    "coupons/getCoupons",
    async () => {
        try {
            const isExistFromAdmin = localStorage.getItem('/studio-sasvat/coupons')
            const isExistSearchedKeyword = localStorage.getItem('/studio-sasvat/couponsSearchFilter')
            
            if (isExistFromAdmin) {
                var pageObj = JSON.parse(isExistFromAdmin)
                var pageNumber = pageObj?.page 
            } else {
                var pageNumber = 1
            }

            if (isExistSearchedKeyword && isExistSearchedKeyword != '') {
                var searchedRecord = isExistSearchedKeyword
            } else {
                var searchedRecord = ''
            }

            const response = await axios.get(`${baseURL}/coupon`,{
                headers: {
                    "page-number": pageNumber,
                    "searched-record": searchedRecord,
                },
            });
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const getValidCoupon = createAsyncThunk(
    "coupons/getValidCoupon",
    async (coupon, { rejectWithValue }) => {
        try {
            const token = Cookies.get("studioSasvatLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/coupon-valid`, JSON.stringify(coupon), {
                headers: {
                    "x-authorization": `Bearer ${user_id}`,
                    "Content-Type": "application/json"
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const validateCoupon = createAsyncThunk(
    "coupons/validateCoupon",
    async (coupon, { rejectWithValue }) => {
        try {
            const token = Cookies.get("studioSasvatLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.post(`${baseURL}/validate-coupon`, JSON.stringify(coupon), {
                headers: {
                    "x-authorization": `Bearer ${user_id}`,
                    "Content-Type": "application/json"
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getCoupon = createAsyncThunk(
    "coupons/getCoupon",
    async (couponId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${baseURL}/coupon/${couponId}`
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);

export const updateCoupon = createAsyncThunk(
    "coupons/updateCoupon",
    async (coupon, { rejectWithValue }) => {
        try {
            const token = Cookies.get("studioSasvatLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;
            
            const response = await axios.put(
                `${baseURL}/coupon/${coupon.get('id')}`,
                coupon,
                {
                    headers: {
                        "x-authorization": `Bearer ${user_id}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const deleteCoupon = createAsyncThunk(
    "coupons/deleteCoupon",
    async (couponId, { rejectWithValue }) => {
        try {
            const token = Cookies.get("studioSasvatLoggedInUserToken");
            const decodedData = jwtDecode(token);
            const user_id = decodedData?.id;

            const response = await axios.delete(
                `${baseURL}/coupon/${couponId}`,{
                    headers: {
                        "x-authorization": `Bearer ${user_id}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            return error.response.data.message;
        }
    }
);


const couponsSlice = createSlice({
    name: "coupons",
    initialState,
    reducers: {
        resetCouponState: (state) => initialState,
    },
    extraReducers: (builder) => {
        // create reducers
        builder
        .addCase(createCoupon.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(createCoupon.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Coupon created successfully";
        })
        .addCase(createCoupon.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.payload;
        });

        // get all reducers
        builder
        .addCase(getCoupons.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getCoupons.fulfilled, (state, action) => {
            state.coupons = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All";
        })
        .addCase(getCoupons.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });
       
        // get all valid reducers
        builder
        .addCase(getValidCoupon.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getValidCoupon.fulfilled, (state, action) => {
            state.coupons = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get All Valid";
        })
        .addCase(getValidCoupon.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // get validate coupon reducer
        builder
        .addCase(validateCoupon.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(validateCoupon.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Coupon validated successfully";
        })
        .addCase(validateCoupon.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action?.payload;
        });

        // get reducers
        builder
        .addCase(getCoupon.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(getCoupon.fulfilled, (state, action) => {
            state.coupons = action.payload;
            state.responseStatus = "success";
            state.responseMessage = "Get Single";
        })
        .addCase(getCoupon.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

        // update reducers
        builder
        .addCase(updateCoupon.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(updateCoupon.fulfilled, (state, action) => {
            if (Array.isArray(state.coupons)) {
            state.coupons = state.coupons.map((coupon) =>
                coupon.id === action.payload._id ? action.payload : coupon
            );
            } else {
            state.coupons = action.payload;
            }
            state.responseStatus = "success";
            state.responseMessage = "Coupon updated successfully";
        })
        .addCase(updateCoupon.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });

         // delete reducers
        builder
        .addCase(deleteCoupon.pending, (state) => {
            state.responseStatus = "pending";
        })
        .addCase(deleteCoupon.fulfilled, (state) => {
            state.responseStatus = "success";
            state.responseMessage = "Coupon deleted successfully";
        })
        .addCase(deleteCoupon.rejected, (state, action) => {
            state.responseStatus = "rejected";
            state.responseMessage = action.payload;
        });
    },
});

export const { resetCouponState } = couponsSlice.actions;
export default couponsSlice.reducer;