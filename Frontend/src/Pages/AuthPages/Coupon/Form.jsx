/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../../Components/Layout/AdminNavbar'
import AdminBottomNavigation from '../../../Components/Layout/AdminBottomNavigation'
import { Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import RichTextEditor from '../../../Components/InputComponents/RichTextEditor'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
import FullPageLoader from '../../../Components/Loaders/FullPageLoader'
import { createCoupon, getCoupon, resetCouponState, updateCoupon } from '../../../Features/Coupon/CouponSlice'
import AdminAuth from '../../../Components/Authentication/AdminAuth'

const CouponForm = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id: updateId } = useParams()

    const fields = {
        couponName: '',
        couponDescription: '',
        couponMinimumCartValue: '',
        couponPrice: '',
        couponPercentage: '',
        couponBasedOn: '',
        couponValidUpto: '',
        couponApplyLimit: 1,
    }

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [data, setData] = useState(fields)
    const [isUpdating, setIsUpdating] = useState(false)
    const [couponDescription, setCouponDescription] = useState('')

    const { coupons, responseStatus, responseMessage } = useSelector(state => state.coupons)

    const fetchCoupon = (couponId) => {
        setFullPageLoading(true)
        dispatch(getCoupon(couponId))
    }

    const handleInput = (e) => {
        if (e.target.name == 'couponMinimumCartValue' && (e.target.value == 0 || e.target.value == '')) {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                couponPrice: '',
                couponPercentage: ''
            })
        } else {
            if (e.target.name === 'couponMinimumCartValue' && e.target.value !== 0 && e.target.value !== '') {
                setData({
                    ...data,
                    [e.target.name]: e.target.value,
                    couponPrice: (data?.couponPercentage / 100) * e.target.value,
                    couponPercentage: data?.couponPrice ? (data.couponPrice / e.target.value) * 100 : data.couponPercentage
                });
            } else if (e.target.name === 'couponPrice' && e.target.value !== 0 && e.target.value !== '') {
                setData({
                    ...data,
                    [e.target.name]: e.target.value,
                    couponPercentage: (e.target.value / data?.couponMinimumCartValue) * 100
                });
            } else if (e.target.name === 'couponPercentage' && e.target.value !== 0 && e.target.value !== '') {
                setData({
                    ...data,
                    [e.target.name]: e.target.value,
                    couponPrice: (e.target.value / 100) * data?.couponMinimumCartValue
                });
            } else {
                setData({
                    ...data,
                    [e.target.name]: e.target.value
                });
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        setFullPageLoading(true)

        const formdata = new FormData()
        if (isUpdating) {
            formdata.append('id', updateId)
        }
        formdata.append('couponName', data?.couponName)
        formdata.append('couponDescription', !isUpdating ? data?.couponDescription : couponDescription)
        formdata.append('couponMinimumCartValue', data?.couponMinimumCartValue)
        formdata.append('couponPrice', data?.couponPrice)
        formdata.append('availableQuantity', data?.availableQuantity)
        formdata.append('couponPercentage', data?.couponPercentage)
        formdata.append('couponBasedOn', data?.couponBasedOn)
        formdata.append('couponValidUpto', data?.couponValidUpto)
        formdata.append('couponApplyLimit', data?.couponApplyLimit)

        if (!isUpdating) {
            dispatch(createCoupon(formdata))       
        } else {
            dispatch(updateCoupon(formdata))       
        }
    }

    useEffect(()=>{
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)
    },[])

    useEffect(()=>{
        if (updateId) {
            setIsUpdating(true)
            fetchCoupon(updateId)
        }
    },[updateId])

    useEffect(()=>{
        if(responseStatus == 'success' && (responseMessage == 'Coupon created successfully' || responseMessage == 'Coupon updated successfully')){
            setFullPageLoading(false)
            Swal.fire({
                icon: "success",
                title: "Congrats",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetCouponState())
                navigate('/studio-sasvat/coupons')
            }, 1000);
        }
        if(responseStatus == 'success' && responseMessage == 'Get Single'){
            setCouponDescription(coupons?.data?.couponDescription)
            setTimeout(() => {
                setData({
                    ...data,
                    couponName: coupons?.data?.couponName,
                    couponMinimumCartValue: coupons?.data?.couponMinimumCartValue,
                    couponPrice: coupons?.data?.couponPrice,
                    couponPercentage: coupons?.data?.couponPercentage,
                    couponBasedOn: coupons?.data?.couponBasedOn,
                    couponValidUpto: coupons?.data?.couponValidUpto,
                    couponApplyLimit: coupons?.data?.couponApplyLimit,
                })
            }, 1000);
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(responseStatus == 'rejected' && responseMessage != '' && responseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetCouponState())
                navigate('/studio-sasvat/coupons')
            }, 1000);
        }
    },[coupons, responseStatus, responseMessage])

    return (
        <>
            <AdminAuth />
            { fullPageLoading && <FullPageLoader /> }
            <AdminNavbar />
            <div className="container mt-5">
                <br /><br /><br /><br />
                <div className="custom-box-shadow p-3">
                    <h6>ADD COUPON</h6>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <TextField 
                                    id="outlined-basic" 
                                    label="Coupon Name" 
                                    className='w-100 mb-3'
                                    size='small'
                                    variant="outlined"
                                    name='couponName'
                                    value={data?.couponName}
                                    onChange={handleInput}
                                    required 
                                />
                            </div>
                            <div className="col-md-6">
                                <TextField 
                                    type='number'
                                    id="outlined-basic" 
                                    label="Minimum Cart Value" 
                                    className='w-100 mb-3'
                                    size='small'
                                    variant="outlined" 
                                    name='couponMinimumCartValue'
                                    value={data?.couponMinimumCartValue}
                                    onChange={handleInput}
                                    required 
                                />
                            </div>
                            <div className="col-md-3">
                                <TextField 
                                    type='number'
                                    id="outlined-basic" 
                                    label="Discount in rs" 
                                    className='w-100 mb-3'
                                    size='small'
                                    variant="outlined" 
                                    name='couponPrice'
                                    value={data?.couponPrice}
                                    onChange={handleInput}
                                    disabled={data?.couponMinimumCartValue == 0 || data?.couponMinimumCartValue == '' ? true : false}
                                    required 
                                />
                            </div>
                            <div className="col-md-3">
                                <TextField 
                                    type='number'
                                    id="outlined-basic" 
                                    label="Discount in %" 
                                    className='w-100 mb-3'
                                    size='small'
                                    variant="outlined" 
                                    name='couponPercentage'
                                    value={data?.couponPercentage}
                                    onChange={handleInput}
                                    disabled={data?.couponMinimumCartValue == 0 || data?.couponMinimumCartValue == '' ? true : false}
                                    required 
                                />
                            </div>
                            <div className="col-md-3">
                                <TextField 
                                    type='date'
                                    id="outlined-basic" 
                                    label="Valid Upto" 
                                    className='w-100 mb-3'
                                    size='small'
                                    variant="outlined" 
                                    name='couponValidUpto'
                                    value={data?.couponValidUpto}
                                    onChange={handleInput}
                                    required 
                                />
                            </div>
                            <div className="col-md-3">
                                <TextField 
                                    type='number'
                                    id="outlined-basic" 
                                    label="Apply Limit" 
                                    className='w-100 mb-3'
                                    size='small'
                                    variant="outlined" 
                                    name='couponApplyLimit'
                                    value={data?.couponApplyLimit}
                                    onChange={handleInput}
                                    required 
                                />
                            </div>
                            <div className="col-md-12 my-3">
                                <div className='border border-secondary-subtle rounded p-3'>
                                    <span className='text-secondary fw-bold'>Select Coupon Type<span className='text-red'>*</span></span>
                                    <div className='d-flex align-items-center gap-2 mt-2'>
                                        <input 
                                            type="radio"
                                            role='button'
                                            id='couponBasedOnRupees'
                                            name='couponBasedOn'
                                            value='Rupees'
                                            checked={data?.couponBasedOn == 'Rupees' ? 'checked' : ''}
                                            onChange={handleInput}
                                        />
                                        <label role='button' htmlFor='couponBasedOnRupees'>Keep this coupon based on Discount in Rs.</label>
                                    </div>
                                    <div className='d-flex align-items-center gap-2 mt-2'>
                                        <input 
                                            type="radio"
                                            role='button'
                                            id='couponBasedOnDiscount'
                                            name='couponBasedOn'
                                            value='Discount'
                                            checked={data?.couponBasedOn == 'Discount' ? 'checked' : ''}
                                            onChange={handleInput}
                                        />
                                        <label role='button' htmlFor='couponBasedOnDiscount'>Keep this coupon based on Discount in %.</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <small className='fw-bold text-secondary'>Terms & Condition<span className='text-red'>*</span></small>
                                <RichTextEditor
                                    data={isUpdating ? couponDescription : data?.couponDescription} 
                                    onChange={(e)=>{
                                        setData({
                                            ...data,
                                            couponDescription: e
                                        })
                                        if (isUpdating) {
                                            setCouponDescription(e)
                                        }
                                    }} 
                                />
                            </div>
                            <div className="col-md-12 mt-3">
                                <Button type='submit' variant="contained" className='px-4 bg-button-primary' size='small'><SaveOutlinedIcon fontSize='small' />&nbsp;&nbsp;SAVE</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <AdminBottomNavigation />
        </>
    )
}

export default CouponForm