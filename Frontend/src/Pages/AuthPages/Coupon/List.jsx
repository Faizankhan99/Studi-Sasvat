/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../../Components/Layout/AdminNavbar'
import AdminBottomNavigation from '../../../Components/Layout/AdminBottomNavigation'
import { Avatar, Button, ButtonGroup, IconButton, Switch, TextField, Tooltip } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2';
import FullPageLoader from '../../../Components/Loaders/FullPageLoader'
import { deleteCoupon, getCoupons, resetCouponState } from '../../../Features/Coupon/CouponSlice'
import AdminAuth from '../../../Components/Authentication/AdminAuth'


const CouponList = () => {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [list, setList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchedRecord, setSearchedRecord] = useState('')

    const { coupons, responseStatus, responseMessage } = useSelector(state => state.coupons)

    const formattedDate = (date) => {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return formattedDate;
    }

    const handleSearchFilter = () => {
        setFullPageLoading(true)
        localStorage.setItem(`${pathname}SearchFilter`, searchedRecord)
        localStorage.removeItem(pathname)
        localStorage.setItem(pathname, JSON.stringify({ page: 1 }))
        dispatch(getCoupons());
    }

    const handleCouponStatusChange = (couponId) => {
        setTimeout(() => {
            setFullPageLoading(true)
            dispatch(deleteCoupon(couponId))
        }, 500)
    }

    useEffect(()=>{
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)

        localStorage.removeItem(`${pathname}SearchFilter`)
        localStorage.removeItem(pathname)
    },[])

    useEffect(() => {
        dispatch(getCoupons());
    }, [dispatch]);

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'Get All'){
            setList(coupons?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(responseStatus == 'success' && responseMessage == 'Coupon deleted successfully'){
            dispatch(getCoupons())
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
                <div className="row pt-5">
                    <div className="col-md-12">
                        <div className='d-flex align-items-center justify-content-between mb-3'>
                            <h6>COUPON LIST</h6>
                            <Button type='button' variant="outlined" className='px-4 border-primary text-primary' size='small' onClick={()=>setTimeout(() => {
                                navigate('/studio-sasvat/coupon-add')
                            }, 500)}><AddIcon fontSize='small' />&nbsp;ADD NEW</Button>
                        </div>
                        <div className='bg-white p-3 custom-box-shadow'>
                            <TextField
                                type='search' 
                                id="outlined-basic" 
                                label="Search here" 
                                className='w-100 mb-3'
                                sx={{ maxWidth: '300px' }}
                                onChange={e => setSearchedRecord(e.target.value)}
                                value={searchedRecord}
                                size='small'
                                variant="standard"
                                InputProps={{
                                    endAdornment: (
                                        <SearchIcon sx={{ cursor: 'pointer' }} onClick={handleSearchFilter} />
                                    ),
                                }}
                            />
                            <div style={{ overflowX: 'auto' }}>
                                <table className='table table-bordered table-hover'>
                                    <thead>
                                        <th className='p-2 text-nowrap'>#</th>
                                        <th className='p-2 text-nowrap'>COUPON NAME</th>
                                        <th className='p-2 text-nowrap'>MINIMUM CART VALUE</th>
                                        <th className='p-2 text-nowrap'>DISCOUNT IN RS.</th>
                                        <th className='p-2 text-nowrap'>DISCOUNT IN %</th>
                                        <th className='p-2 text-nowrap'>COUPON TYPE (BASED ON)</th>
                                        <th className='p-2 text-nowrap'>VALID UPTO</th>
                                        <th className='p-2 text-nowrap'>STATUS</th>
                                        <th className='p-2 text-nowrap'>ACTION</th>
                                    </thead>
                                    <tbody>
                                        {
                                            Array?.isArray(list) && list?.map((val,key)=>(
                                                <tr key={key}>
                                                    <td className='p-2 text-nowrap'>{key+1}.</td>
                                                    <td className='p-2 text-nowrap'><Link to={`/studio-sasvat/coupon-edit/${val?._id}`} className='text-decoration-none text-primary fw-bold'>{val?.couponName}</Link></td>
                                                    <td className='p-2 text-nowrap'>₹{val?.couponMinimumCartValue}</td>
                                                    <td className='p-2 text-nowrap'>₹{val?.couponPrice}</td>
                                                    <td className='p-2 text-nowrap'>{val?.couponPercentage}%</td>
                                                    <td className='p-2 text-nowrap'>{val?.couponBasedOn}</td>
                                                    <td className='p-2 text-nowrap'>{formattedDate(val?.couponValidUpto)}</td>
                                                    <td className='p-2 text-nowrap'><Switch size="small" color="success" checked={val?.isDeleted == 0 ? 'checked' : ''} onClick={()=>handleCouponStatusChange(val?._id)} /></td>
                                                    <td className='p-2 text-nowrap'>
                                                        <Tooltip title="Edit" onClick={()=>setTimeout(() => {
                                                            navigate(`/studio-sasvat/coupon-edit/${val?._id}`)
                                                        }, 500)}>
                                                            <IconButton>
                                                                <EditIcon fontSize='small' className='text-primary' />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" onClick={()=>handleCouponStatusChange(val?._id)}>
                                                            <IconButton>
                                                                <DeleteIcon fontSize='small' className='text-primary' />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div>&nbsp;</div>
                                <div>
                                    <ButtonGroup variant="outlined" className='mt-1' aria-label="Basic button group">
                                        <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                            const isPathExist = localStorage.getItem(pathname)
                                            if (isPathExist) {
                                                localStorage.removeItem(pathname)
                                            }
                                            const newPage = currentPage - 1
                                            setCurrentPage(currentPage - 1)
                                            localStorage.setItem(pathname, JSON.stringify({ page: newPage }))
                                            setFullPageLoading(true)
                                            dispatch(getCoupons())
                                        }} disabled={ currentPage == 1 ? true : false }><ChevronLeftIcon /></Button>
                                        <Button sx={{ width: '60px' }} className='border-primary text-primary'>{currentPage}</Button>
                                        <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                            const isPathExist = localStorage.getItem(pathname)
                                            if (isPathExist) {
                                                localStorage.removeItem(pathname)
                                            }
                                            const newPage = currentPage + 1
                                            setCurrentPage(currentPage + 1)
                                            localStorage.setItem(pathname, JSON.stringify({ page: newPage }))
                                            setFullPageLoading(true)
                                            dispatch(getCoupons())
                                        }} disabled={ coupons?.totalRecords <= 12 * currentPage ? true : false }><ChevronRightIcon /></Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AdminBottomNavigation />
        </>
    )
}

export default CouponList