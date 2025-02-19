/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import FullPageLoader from '../../Components/Loaders/FullPageLoader';
import Navbar from '../../Components/Layout/Navbar';
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, ButtonGroup, FormControl, FormControlLabel, IconButton, Modal, Paper, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import ProductSwiper from '../../Components/Swiper/ProductSwiper'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlainSwiper from '../../Components/Swiper/PlainSwiper';
import { Link, useNavigate } from 'react-router-dom';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"
import { useDispatch, useSelector } from 'react-redux';
import { resetCartState } from '../../Features/Cart/CartSlice';
import Swal from 'sweetalert2';
import axios from 'axios';
import { createOrder, resetOrderState } from '../../Features/Order/OrderSlice';
import { getValidCoupon, resetCouponState, validateCoupon } from '../../Features/Coupon/CouponSlice';


const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 300,
    maxWidth: 600,
    width: '100%',
    borderRadius: '15px',
    bgcolor: '#000000e8',
    boxShadow: 24,
    p: 4,
}

const Checkout = () => {

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const fields = {
        orderId: '',
        paymentId: '',
        name: '',
        email: '',
        contactNumber: '',
        alternateNumber: '',
        pincode: '',
        city: '',
        state: '',
        country: '',
        fullAddress: '',
        products: [],
        paymentMode: ''
    }

    const couponFields = {
        _id: '',
        couponName: '',
        couponMinimumCartValue: '',
        couponPrice: '',
        couponPercentage: '',
        couponBasedOn: '',
        couponValidUpto: '',
        applyLimit: '',
        isValidate: false
    }

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)
    const [showCouponModal, setShowCouponModal] = useState(false)
    const [checkoutData, setCheckoutData] = useState(fields)
    const [cartData, setCartData] = useState([])
    const [couponData, setCouponData] = useState([])
    const [couponSelected, setCouponSelected] = useState(couponFields)

    const { carts, responseStatus: cartResponseStatus, responseMessage: cartResponseMessage } = useSelector(state => state.carts)
    const { orders, responseStatus: ordersResponseStatus, responseMessage: ordersResponseMessage } = useSelector(state => state.orders)
    const { coupons, responseStatus: couponsResponseStatus, responseMessage: couponsResponseMessage } = useSelector(state => state.coupons)

    const checkValidOffers = (cartValue) => {
        setFullPageLoading(true)
        dispatch(getValidCoupon({ data: cartValue }))
    }
    
    const handleCouponValidate = (coupon) => {
        setFullPageLoading(true)
        setCouponSelected(coupon)
        dispatch(validateCoupon({ couponId: coupon?._id }))
    }

    const removeCoupon = () => {
        setCouponSelected(couponFields)
        dispatch(resetCouponState())
    }

    const handleInput = (e) => {
        setCheckoutData({
            ...checkoutData,
            [e.target.name]: e.target.value
        })
    }

    const calculateGrandTotal = () => {
        return cartData.reduce((total, val) => total + val.price * val.quantitySelected, 0);
    };

    const grandTotal = calculateGrandTotal();

    const handleButtonClick = () => {
        // setIsTruckMoving(true);
        // console.log('working');

        if (checkoutData?.name == '' || checkoutData?.email == '' || checkoutData?.contactNumber == '' || checkoutData?.pincode == '' || checkoutData?.city == '' || checkoutData?.state == '' || checkoutData?.country == '' || checkoutData?.fullAddress == '') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: 'Please fill required details'
            });
        } else {
            if (cartData?.length > 0) {
                if (checkoutData?.paymentMode == '') {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: 'Please select any payment method'
                    });
                } else {
                    const orderData = {
                        orderId: checkoutData?.orderId,
                        paymentId: checkoutData?.paymentId,
                        billingAddressName: checkoutData?.name,
                        billingAddressEmail: checkoutData?.email,
                        billingAddressContactNumber: checkoutData?.contactNumber,
                        billingAddressAlternateNumber: checkoutData?.alternateNumber,
                        billingAddressPincode: checkoutData?.pincode,
                        billingAddressCity: checkoutData?.city,
                        billingAddressState: checkoutData?.state,
                        billingAddressCountry: checkoutData?.country,
                        billingAddressFullAddress: checkoutData?.fullAddress,
                        products: cartData,
                        paymentMode: checkoutData?.paymentMode,
                        grandTotal: couponSelected?._id != '' ? grandTotal : Number(grandTotal) - Number(couponSelected?.couponPrice),
                        couponId: couponSelected?._id != '' ? couponSelected?._id : null,
                        couponName: couponSelected?.couponName,
                        couponMinimumCartValue: couponSelected?.couponMinimumCartValue,
                        couponPrice: couponSelected?.couponPrice,
                        couponPercentage: couponSelected?.couponPercentage,
                        couponBasedOn: couponSelected?.couponBasedOn,
                        couponValidUpto: couponSelected?.couponValidUpto,
                        applyLimit: couponSelected?.applyLimit,
                    }
                    if (checkoutData?.paymentMode == 'Online') {
                        displayRazorpay()
                    } else {
                        setFullPageLoading(true)
                        dispatch(createOrder(orderData))
                    }
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: 'Please select atleast one product'
                });
            }     
        }
    };

    async function displayRazorpay() {
        setFullPageLoading(true)

        const res = await loadScript(
          'https://checkout.razorpay.com/v1/checkout.js'
        );
    
        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          return;
        }
    
        const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/payment/initiate`,{ amount: grandTotal});
    
        if (!result) {
          alert('Server error. Are you online?');
          return;
        }

        setFullPageLoading(false)
    
        const { amount, id: order_id, currency } = result.data;
    
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: amount.toString(),
          currency: currency,
          name: 'SASVAT',
          description: 'Test Transaction',
          image:  '/logoFinal.png',
          order_id: order_id,
          handler: async function (response) {
            const data = {
              orderCreationId: order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };
    
            const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/payment/callback`, data);
            
            const orderData = {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                name: checkoutData?.name,
                email: checkoutData?.email,
                contactNumber: checkoutData?.contactNumber,
                alternateNumber: checkoutData?.alternateNumber,
                pincode: checkoutData?.pincode,
                city: checkoutData?.city,
                state: checkoutData?.state,
                country: checkoutData?.country,
                billingAddressName: checkoutData?.name,
                billingAddressEmail: checkoutData?.email,
                billingAddressContactNumber: checkoutData?.contactNumber,
                billingAddressAlternateNumber: checkoutData?.alternateNumber,
                billingAddressPincode: checkoutData?.pincode,
                billingAddressCity: checkoutData?.city,
                billingAddressState: checkoutData?.state,
                billingAddressCountry: checkoutData?.country,
                billingAddressFullAddress: checkoutData?.fullAddress,
                products: cartData,
                paymentMode: checkoutData?.paymentMode,
                grandTotal: couponSelected?._id != '' ? grandTotal : Number(grandTotal) - Number(couponSelected?.couponPrice),
                couponId: couponSelected?._id != '' ? couponSelected?._id : null,
                couponName: couponSelected?.couponName,
                couponMinimumCartValue: couponSelected?.couponMinimumCartValue,
                couponPrice: couponSelected?.couponPrice,
                couponPercentage: couponSelected?.couponPercentage,
                couponBasedOn: couponSelected?.couponBasedOn,
                couponValidUpto: couponSelected?.couponValidUpto,
                applyLimit: couponSelected?.applyLimit,
            }
            dispatch(createOrder(orderData))
    
            alert(result.data.msg);
        },
          prefill: {
            name: checkoutData?.name,
            email: checkoutData?.email,
            contact: checkoutData?.contactNumber,
          },
          notes: {
            address: 'CITY CENTER GWALIOR',
          },
          theme: {
            color: '#61dafb',
          },
        };
    
        const paymentObject = new window.Razorpay(options);
        // paymentObject.on("payment.failed", function (response) {
        //     alert(response.error.code);
        //     alert(response.error.description);
        //     alert(response.error.source);
        //     alert(response.error.step);
        //     alert(response.error.reason);
        //     alert(response.error.metadata.order_id);
        //     alert(response.error.metadata.payment_id);
        //   })
        paymentObject.open();
    }

    useEffect(()=>{
        const user = Cookies.get('studioSasvatLoggedInUser')
        const token = Cookies.get('studioSasvatLoggedInUserToken')
        
        if (user && token) {
            const userObj = JSON.parse(user)
            setCheckoutData({
                ...checkoutData,
                name: userObj?.name,
                email: userObj?.email,
                contactNumber: userObj?.contactNumber,
                alternateNumber: userObj?.alternateNumber,
                pincode: userObj?.pincode,
                city: userObj?.city,
                state: userObj?.state,
                country: userObj?.country
            })
        } else {
            navigate('/login')
        }

        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)

        localStorage.removeItem('/all-products')
        localStorage.removeItem(`/studio-sasvat/ordersSearchFilter`)
        localStorage.removeItem(`/studio-sasvat/productsSearchFilter`)
        localStorage.removeItem('/studio-sasvat/products')
        localStorage.removeItem('/related-products')
        localStorage.removeItem('/category-product')
        localStorage.removeItem('/sub-category-product')
    },[])
    

    useEffect(()=>{
        if(cartResponseStatus == 'success' && cartResponseMessage == 'Get All'){
            // setCheckoutData({
            //     ...checkoutData,
            //     products: carts?.data
            // })
            if (carts?.data?.length > 0) {
                setCartData(carts?.data)
                
                setTimeout(() => {
                    setFullPageLoading(false)
                }, 1000);
            } else {
                navigate(-1)
            }
            setRenderNavCart(true)
        }
        if(cartResponseStatus == 'rejected' && cartResponseMessage != '' && cartResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: cartResponseMessage
            });
            setTimeout(() => {
                dispatch(resetCartState())
            }, 1000);
        }
    },[carts, cartResponseStatus, cartResponseMessage])

    useEffect(()=>{
        if(ordersResponseStatus == 'success' && ordersResponseMessage == 'Order Placed Successfully'){
            setFullPageLoading(false)
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: ordersResponseMessage
            });
            setTimeout(() => {
                dispatch(resetOrderState())
                navigate('/my-orders')
            }, 1000);
        }
        if(ordersResponseStatus == 'rejected' && ordersResponseMessage != '' && ordersResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: ordersResponseMessage
            });
            setTimeout(() => {
                dispatch(resetOrderState())
            }, 1000);
        }
    },[orders, ordersResponseStatus, ordersResponseMessage])

    useEffect(()=>{
        if(couponsResponseStatus == 'success' && couponsResponseMessage == 'Get All Valid'){
            setCouponData(coupons?.data)
            setShowCouponModal(true)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 500)
        }
        if(couponsResponseStatus == 'success' && couponsResponseMessage == 'Coupon validated successfully'){
            setShowCouponModal(false)
            setCouponSelected({...couponSelected, isValidate: true})
            dispatch(resetCouponState())
            setTimeout(() => {
                setFullPageLoading(false)
            }, 500)
        }
        if(couponsResponseStatus == 'rejected' && couponsResponseMessage != '' && couponsResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: couponsResponseMessage
            });
            setTimeout(() => {
                dispatch(resetCartState())
            }, 1000);
        }
    },[coupons, couponsResponseStatus, couponsResponseMessage])

    return (
        <>
            { fullPageLoading && <FullPageLoader /> }
            <Navbar renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
            <div className="container mt-5">
                <center>
                    <div className='text-primary mt-3 fs-4 fw-bold'>Welcome to Studio Sasvat</div>
                    <div className='mt-1 site-content'>
                        Your ultimate destination for exquisite art and unique decor pieces. Our collection is meticulously curated to inspire and transform your living spaces with creativity and elegance. We believe that every home should reflect the personality and taste of its owner, and our wide range of products is designed to do just that.

                        From stunning paintings and sculptures to innovative decor accessories, our offerings are a perfect blend of artistry and craftsmanship. Each piece in our collection is selected for its quality and uniqueness, ensuring that you find something truly special for your home.

                        Whether you are looking to add a touch of sophistication to your living room, bring warmth to your bedroom, or make a bold statement in your office, Studio Sasvat has something for every style and space. We are dedicated to helping you create an environment that not only looks beautiful but also feels like home.

                        Discover the joy of decorating with our diverse range of products and let your decor journey begin. Shop now and transform your space into a haven of beauty and inspiration.
                    </div>
                </center>
                <div className='row'>
                    <h5 className='mt-4'>Checkout</h5>
                    <div className="col-md-7">
                        <div className='bg-white custom-box-shadow mt-3 p-3'>
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="name" className='mb-2'>Name<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="name" 
                                        label="Enter Name" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="name"
                                        value={checkoutData?.name}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="email" className='mb-2'>Email<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="email" 
                                        label="Enter Email" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="email"
                                        value={checkoutData?.email}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="contactNumber" className='mb-2'>Contact Number<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8 mb-3">
                                    <TextField 
                                        id="contactNumber" 
                                        label="Enter Contact Number" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100'
                                        name="contactNumber"
                                        value={checkoutData?.contactNumber}
                                        onChange={handleInput}
                                    />
                                    <div className='fw-bold text-red' style={{ fontSize: '12px' }}><small><i className="fa-solid fa-circle-exclamation"></i> Contact number must be of 10 digit and must be registered on WhatsApp to receive updates.</small></div>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="alternateNumber" className='mb-2'>Alternate Number :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="alternateNumber" 
                                        label="Enter Alternate Number" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="alternateNumber"
                                        value={checkoutData?.alternateNumber}
                                        onChange={handleInput} 
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="pincode" className='mb-2'>Pincode<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="pincode" 
                                        label="Enter Pincode" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="pincode"
                                        value={checkoutData?.pincode}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="city" className='mb-2'>City<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="city" 
                                        label="Enter City" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="city"
                                        value={checkoutData?.city}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="state" className='mb-2'>State<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="state" 
                                        label="Enter State" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="state"
                                        value={checkoutData?.state}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="country" className='mb-2'>Country<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField 
                                        id="country" 
                                        label="Enter Country" 
                                        variant="outlined"
                                        size='small'
                                        className='w-100 mb-3'
                                        name="country"
                                        value={checkoutData?.country}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="fullAddress" className='mb-2'>Full Address<span className='text-red'>*</span> :</label>
                                </div>
                                <div className="col-md-8">
                                    <TextField
                                        id="outlined-textarea"
                                        label="Enter Full Address"
                                        className='w-100'
                                        name="fullAddress"
                                        value={checkoutData?.fullAddress}
                                        onChange={handleInput} 
                                        rows={4}
                                        multiline
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className='bg-white custom-box-shadow mt-3'>
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='fw-bold'>Summary</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='fw-bold'>Product</TableCell>
                                            <TableCell className='fw-bold'>Price</TableCell>
                                            <TableCell className='fw-bold'>Qty</TableCell>
                                            <TableCell className='fw-bold'>Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            Array?.isArray(cartData) && cartData?.map((val,key)=>(
                                                <TableRow key={key}>
                                                    <TableCell className='d-flex align-items-center gap-2 fw-bold text-secondary'><Avatar alt={val?.productImageUrl} src={val?.productImageUrl} />{val?.productName}</TableCell>
                                                    <TableCell>₹{val?.price}</TableCell>
                                                    <TableCell>{val?.quantitySelected}</TableCell>
                                                    <TableCell>₹{val?.quantitySelected * val?.price}</TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='fw-bold'>Sub Total</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell className='fw-bold'>₹{grandTotal}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className='bg-white custom-box-shadow mt-3'>
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='fw-bold' colSpan={3}>Have a coupon ?</TableCell>
                                            <TableCell>
                                                <Button type='button' variant="contained" size='small' className='bg-button-primary' onClick={()=>checkValidOffers(grandTotal)}>Check</Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {
                                        couponSelected?.isValidate ?
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Coupon Applied <i className="fa-solid fa-circle-check text-success"></i></TableCell>
                                                    <TableCell>{couponSelected?.couponName}</TableCell>
                                                    <TableCell><span role='button' className='text-red fw-bold' onClick={removeCoupon}><small><i className="fa-regular fa-circle-xmark"></i> REMOVE</small></span></TableCell>
                                                    <TableCell>-₹{couponSelected?.couponPrice || 0}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        : ''
                                    }
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='fw-bold'>Grand Total</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>₹{checkoutData?.couponId == '' ? grandTotal : Number(grandTotal) - Number(checkoutData?.couponPrice || 0)}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className='bg-white custom-box-shadow mt-3'>
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='fw-bold'>Select Payment mode</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <div className="form-check">
                                                    <input role='button' className="form-check-input" type="radio" name="paymentMode" value="Online" id="flexRadioDefault1" onClick={(e)=>setCheckoutData({
                                                        ...checkoutData,
                                                        paymentMode: e.target.value
                                                    })} />
                                                    <label role='button' className="form-check-label" htmlFor="flexRadioDefault1">
                                                        <img src="/payOnline3.png" style={{ height: '35px' }} alt="/payOnline3.png" />
                                                    </label>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <div className="form-check">
                                                    <input role='button' className="form-check-input" type="radio" name="paymentMode" value="Cash on Delivery" id="flexRadioDefault2" onClick={(e)=>setCheckoutData({
                                                        ...checkoutData,
                                                        paymentMode: e.target.value
                                                    })} />
                                                    <label role='button' className="form-check-label" htmlFor="flexRadioDefault2">
                                                        <img src="/cod.png" style={{ height: '25px' }} alt="/cod.png" />
                                                    </label>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <Button type='button' variant="contained" size='small' className='w-100 rounded-5 mt-3 mb-4 bg-button-primary' onClick={handleButtonClick}><i className="fa-solid fa-cart-shopping"></i>&nbsp;&nbsp;Place Order ₹{checkoutData?.couponId == '' ? grandTotal : Number(grandTotal) - Number(checkoutData?.couponPrice || 0)}</Button>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />

            {/* Coupon Modal */}
            <Modal
                open={showCouponModal}
                onClose={()=>{
                    setShowCouponModal(false)
                    dispatch(resetCouponState())
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <CloseIcon sx={{ color: '#fff', my: 1, float: 'right', cursor: 'pointer' }} onClick={()=>{
                            setShowCouponModal(false)
                            dispatch(resetCouponState())
                        }} />
                        <div className="row">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className='text-white fs-4 mb-4'>Coupons</div>
                                    <div className="col-md-12 text-white" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                        {
                                            Array?.isArray(couponData) && couponData?.length > 0 ?
                                            Array?.isArray(couponData) && couponData?.map((val,key) => (
                                                <div key={key} className='rounded border border-white p-3 mb-3'>
                                                    <div className='row'>
                                                        <div className="col-md-6">
                                                            <div role='button' className='mb-2' onClick={()=>handleCouponValidate(val)}>{val?.couponName} <span style={{ fontSize: '10px' }}>Click to Apply</span></div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div role='button' style={{ boxShadow: 'rgb(216 195 195 / 35%) -6px 7px 10px' }} onClick={()=>handleCouponValidate(val)}>
                                                                <center>
                                                                    <div style={{ height: '15px', width: '100%' }} className='d-flex align-items-center justify-content-between coupon-header'>
                                                                        <div>&nbsp;</div>
                                                                        <div className='d-flex align-items-center gap-1 px-1'>
                                                                            <div style={{ height: '8px', width: '8px', borderRadius: '100px', backgroundColor: '#000' }}></div>
                                                                            <div style={{ height: '8px', width: '8px', borderRadius: '100px', backgroundColor: '#000' }}></div>
                                                                            <div style={{ height: '8px', width: '8px', borderRadius: '100px', backgroundColor: '#000' }}></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='coupon d-flex flex-column align-items-center justify-content-center' style={{ height: '65px', width: '100%' }}>
                                                                        <div className='fst-italic' style={{ fontSize: '12px', color: '#fbcd73' }}>{val?.couponName}</div>
                                                                        <div className='border border-white rounded py-1 px-5 mt-1' style={{ fontSize: '10px' }}>{val?.couponBasedOn == 'Discount' ? `GET ${val?.couponPercentage}% OFF` : `GET ₹${val?.couponPrice} OFF`}</div>
                                                                    </div>
                                                                </center>
                                                            </div>
                                                        </div>
                                                        <Accordion sx={{ background: 'transparent', p: 0 }}>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                                                                aria-controls="panel1-content"
                                                                id={`panel${key}-header`}
                                                                sx={{ color: '#fff' }}
                                                            >
                                                                Terms & Condition
                                                            </AccordionSummary>
                                                            <AccordionDetails sx={{ p: 0 }}>
                                                                <div style={{ color: '#fff' }}><small><div dangerouslySetInnerHTML={{ __html: val?.couponDescription }} /></small></div>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </div>
                                                </div>
                                            ))
                                            :
                                            <center>No Coupon Available</center>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default Checkout