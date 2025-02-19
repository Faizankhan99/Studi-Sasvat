/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Layout/Navbar'
import FreeModeSwiper from '../../Components/Swiper/FreeModeSwiper'
import ProductSwiper from '../../Components/Swiper/ProductSwiper'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import PlainSwiper from '../../Components/Swiper/PlainSwiper';
import { Box, Button, ButtonBase, ButtonGroup, Checkbox, FormControl, FormControlLabel, IconButton, Modal, Radio, RadioGroup, Rating, Slider, Tooltip, Typography } from '@mui/material';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { getCategoryProduct, getProducts, getSubCategoryProduct, resetProductState } from '../../Features/Product/ProductSlice';
import { createWishlist, getWishlists, resetWishlistState } from '../../Features/Wishlist/WishlistSlice';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const SelectedSubCategoryProducts = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { pathname } = useLocation()
    const { id: subCategoryId } = useParams()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [list, setList] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [wishListArray, setWishListArray] = useState([])
    const [filterApplied, setFilterApplied] = useState(false)
    const [filterTab, setFilterTab] = useState('rating')
    const [filterData, setFilterData] = useState({
        rating: [],
        price: [20,5000],
        discount: [],
        sortBy: '',
    })
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)

    const { products, responseStatus, responseMessage } = useSelector(state => state.products)
    const { wishlists, responseStatus: wishlistResponseStatus, responseMessage: wishlistResponseMessage } = useSelector(state => state.wishlists)

    const handleWishlist = (val) => {
        if (isLoggedIn) {
            const data = {
                productId: val?._id,
                productImageUrl: val?.productImageUrl,
                productName: val?.productName,
                price: val?.price,
                discount: val?.discount,
                freeDelivery: val?.freeDelivery,
                openBoxDelivery: val?.openBoxDelivery,
                returnAndRefund: val?.returnAndRefund,
            }
            setFullPageLoading(true)
            dispatch(createWishlist(data))
        } else {
            navigate('/login')
        }
    }

    function valuetext(value) {
        return `$${value}`;
    }

    const handleRatingCheckboxChange = (value) => {
        setFilterData((prevState) => {
            const currentRatings = prevState.rating;
            if (currentRatings.includes(value)) {
                return {
                    ...prevState,
                    rating: currentRatings.filter((rating) => rating !== value)
                };
            } else {
                return {
                    ...prevState,
                    rating: [...currentRatings, value]
                };
            }
        });
    };

    const handleDiscountCheckboxChange = (value) => {
        setFilterData((prevState) => {
            const currentDiscounts = prevState.discount;
            if (currentDiscounts.includes(value)) {
                return {
                    ...prevState,
                    discount: currentDiscounts.filter((discount) => discount !== value)
                };
            } else {
                return {
                    ...prevState,
                    discount: [...currentDiscounts, value]
                };
            }
        });
    };

    const applyFilter = () => {
        setFilterApplied(true)
    };

    useEffect(()=>{
        const user = Cookies.get('studioSasvatLoggedInUser')
        const token = Cookies.get('studioSasvatLoggedInUserToken')

        if (user && token) {
            setIsLoggedIn(true)
        }
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);

        localStorage.removeItem(`/${pathname?.split('/')[1]}`)
        localStorage.removeItem(`${pathname}SearchFilter`)
        localStorage.removeItem('/studio-sasvat/products')
        localStorage.removeItem('/all-products')
        localStorage.removeItem('/related-products')
        localStorage.removeItem('/category-product')
    },[])

    useEffect(() => {
        if (subCategoryId) {
            dispatch(getSubCategoryProduct(subCategoryId));
            dispatch(getWishlists());
        }
    }, [dispatch, subCategoryId]);

    useEffect(() => {
        let sortedList = [...list];

        if (filterData?.sortBy === 'Price Low to High') {
            sortedList?.sort((a, b) => {
                const priceA = Number(a?.price);
                const priceB = Number(b?.price);
                return priceA - priceB;
            });
        } else if (filterData?.sortBy === 'Price High to Low') {
            sortedList?.sort((a, b) => {
                const priceA = Number(a?.price);
                const priceB = Number(b?.price);
                return priceB - priceA; 
            });
        } else if (filterData?.sortBy === 'Newest First') {
            sortedList?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
        } else if (filterData?.sortBy === 'Popularity') {
            sortedList?.sort((a, b) => b?.quantitySold - a?.quantitySold);
        }

        setList(sortedList);
    }, [filterData.sortBy, list]);

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'Get All Sub Category Wise'){
            setList(products?.data)
            // dispatch(getWishlists());
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
                dispatch(resetProductState())
            }, 1000);
        }
    },[products, responseStatus, responseMessage])

    useEffect(()=>{
        if(wishlistResponseStatus == 'success' && wishlistResponseMessage == 'Item Added Successfully'){
            dispatch(getWishlists());
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(wishlistResponseStatus == 'success' && wishlistResponseMessage == 'Get All'){
            setRenderNavWishlist(true)
            setWishListArray(wishlists?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(wishlistResponseStatus == 'rejected' && wishlistResponseMessage != '' && wishlistResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: wishlistResponseMessage
            });
            setTimeout(() => {
                dispatch(resetWishlistState())
            }, 1000);
        }
    },[wishlists, wishlistResponseStatus, wishlistResponseMessage])

    return (
        <>
            { fullPageLoading && <FullPageLoader /> }
            <Navbar renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
            <div className="container mt-5">
                <div className='row my-5'>
                    <div className='mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3'>
                        <h3 className='text-primary'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> {list[0]?.subCategoryName || 'No Product Found'}</h3>
                        <Button type='button' variant="outlined" className='px-4 border-primary text-primary' size='small' data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation" onClick={()=>setFilterTab('rating')}><FilterAltIcon fontSize='small' /> Filter</Button>
                    </div>
                    {
                        Array?.isArray(list) && list?.map((val, key) => {

                            const ratingMatch = filterData?.rating.length === 0 || filterData?.rating.some(r => val?.currentRating >= r);
                            const discountMatch = filterData?.discount.length === 0 || filterData?.discount.some(d => val?.discount >= d); 
                            const priceMatch = val?.price >= filterData?.price[0] && val?.price <= filterData?.price[1];
                            const sortBy = filterData?.sortBy; 
                        
                            const filterApplied = filterData?.rating.length > 0 || filterData?.discount.length > 0 || sortBy !== '' || (filterData?.price[0] > 0 || filterData?.price[1] < 10000000);
                        
                            if (filterApplied) {
                                if (!ratingMatch || !discountMatch || !priceMatch) {
                                    return null; 
                                }
                            }

                            return (
                                <React.Fragment key={key}>
                                    <div key={key} className={`col-lg-4 col-md-6 col-sm-6 product-card mb-5 ${val?.isDeleted == 1 ? 'd-none' : ''}`} onMouseEnter={() => setHoveredIndex(key)} onMouseLeave={() => setHoveredIndex(null)}>
                                        <div role='button' className='mb-3'>
                                            <div
                                                style={{ 
                                                    width: '100%',
                                                    height: '400px',
                                                    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
                                                }}
                                                className='p-1 product-image-section'
                                                onMouseEnter={() => setHoveredIndex(key)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                            >
                                                {hoveredIndex === key && val?.productVideoUrl && val?.productVideoUrl != '' ? (
                                                    <video
                                                        src={val?.productVideoUrl}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        autoPlay
                                                        loop
                                                        muted
                                                    />
                                                ) : (
                                                    <div 
                                                        style={{ 
                                                            backgroundImage: `url(${val?.productImageUrl})`, 
                                                            width: '100%', 
                                                            height: '100%',
                                                            backgroundPosition: 'center',
                                                            backgroundSize: 'cover',
                                                            backgroundRepeat: 'no-repeat'
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className='pt-2'>
                                                <div className='my-2 fw-bold text-secondary'>
                                                    <div className='d-flex flex-wrap align-items-center justify-content-between'>
                                                        <span onClick={() => navigate(`/product-detail/${val?._id}`)}>{val?.categoryName}</span>
                                                        <div>
                                                            <Tooltip title={wishListArray?.some(product => product?.productId == val?._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                                                                <IconButton onClick={() => handleWishlist(val)}>
                                                                    {wishListArray?.some(product => product?.productId == val?._id) ?
                                                                        <FavoriteIcon role='button' className='text-red' />
                                                                        :
                                                                        <FavoriteBorderIcon role='button' className='text-secondary' />
                                                                    }
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title='Add to Cart' onClick={() => navigate(`/product-detail/${val?._id}`)}>
                                                                <IconButton onClick={() => handleWishlist(val)}>
                                                                    <ShoppingCartOutlinedIcon role='button' className='text-secondary' />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='fw-bold text-dark product-card-product-name fst-italic text-primary mb-0 product-card-product-name' style={{ letterSpacing: '0', fontFamily: 'Cardamon, serif' }} onClick={() => navigate(`/product-detail/${val?._id}`)}>
                                                    {val?.productName?.length > 20 ? `${val?.productName?.substring(0, 20)}...` : val?.productName}
                                                </div>
                                                <div className='d-flex align-items-center justify-content-between mb-0' onClick={() => navigate(`/product-detail/${val?._id}`)}>
                                                    <Rating name="size-small" value={val?.currentRating} precision={0.5} size="small" />
                                                </div>
                                                <div className='d-flex align-items-center gap-3 product-card-product-price' onClick={() => navigate(`/product-detail/${val?._id}`)}>
                                                    <span className='fw-bold text-primary' onClick={() => navigate(`/product-detail/${val?._id}`)}>₹{val?.price}</span>
                                                    <small className='text-secondary fw-bold'><del>₹{(val?.price / (1 - (val?.discount / 100)))?.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</del></small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                        )})
                    }
                    {
                        list?.length > 0 && list?.find(product => product?.isDeleted == 0) ?
                            <div className='d-flex align-items-center justify-content-center gap-4 fs-5 my-4'>
                                <ButtonGroup variant="outlined" className='mt-1' aria-label="Basic button group">
                                    <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                        const isPathExist = localStorage.getItem(`/${pathname?.split('/')[1]}`)
                                        if (isPathExist) {
                                            localStorage.removeItem(`/${pathname?.split('/')[1]}`)
                                        }
                                        const newPage = currentPage - 1
                                        setCurrentPage(currentPage - 1)
                                        localStorage.setItem(`/${pathname?.split('/')[1]}`, JSON.stringify({ page: newPage }))
                                        setFullPageLoading(true)
                                        dispatch(getSubCategoryProduct(subCategoryId))
                                    }} disabled={ currentPage == 1 ? true : false }><ArrowBackIcon /></Button>
                                    <Button sx={{ width: '60px' }} className='border-primary text-primary'>{currentPage}</Button>
                                    <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                        const isPathExist = localStorage.getItem(`/${pathname?.split('/')[1]}`)
                                        if (isPathExist) {
                                            localStorage.removeItem(`/${pathname?.split('/')[1]}`)
                                        }
                                        const newPage = currentPage + 1
                                        setCurrentPage(currentPage + 1)
                                        localStorage.setItem(`/${pathname?.split('/')[1]}`, JSON.stringify({ page: newPage }))
                                        setFullPageLoading(true)
                                        dispatch(getSubCategoryProduct(subCategoryId))
                                    }} disabled={ products?.totalRecords <= 12 * currentPage ? true : false }><ArrowForwardIcon /></Button>
                                </ButtonGroup>
                            </div>
                        : ''
                    }
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
            
            {/* filter modal */}
            <nav className="navbar bg-body-tertiary fixed-top">
                <div className="container-fluid">
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header p-2">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Filter</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body p-2">
                            <div className='w-100 border border-secondary-subtle'>
                                <div className='d-flex'>
                                    <div className='border-end border-secondary-subtle'>
                                        <ButtonBase style={{ fontSize: '14px', width: '100%' }} className={`border-bottom border-secondary-subtle p-3 ${filterTab == 'rating' ? 'fw-bold' : ''}`} onClick={()=>setFilterTab('rating')}>Rating</ButtonBase><br />
                                        <ButtonBase style={{ fontSize: '14px', width: '100%' }} className={`border-bottom border-secondary-subtle p-3 ${filterTab == 'price' ? 'fw-bold' : ''}`} onClick={()=>setFilterTab('price')}>Price</ButtonBase><br />
                                        <ButtonBase style={{ fontSize: '14px', width: '100%' }} className={`border-bottom border-secondary-subtle p-3 ${filterTab == 'discount' ? 'fw-bold' : ''}`} onClick={()=>setFilterTab('discount')}>Discount</ButtonBase><br />
                                        <ButtonBase style={{ fontSize: '14px', width: '100%' }} className={`p-3 ${filterTab == 'sortBy' ? 'fw-bold' : ''}`} onClick={()=>setFilterTab('sortBy')}>Sort by</ButtonBase>
                                    </div>
                                    <div className='p-3'>
                                        {/* rating section */}
                                        {filterTab === 'rating' &&
                                            <div>
                                                <div className='fw-bold'>Rating:</div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={5} 
                                                        onChange={() => handleRatingCheckboxChange(5)}
                                                        checked={filterData.rating.includes(5)}
                                                    /> 
                                                    5 
                                                    <Rating
                                                        name="simple-controlled"
                                                        size="small"
                                                        value={5}
                                                    /> 
                                                    & above 
                                                </div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={4} 
                                                        onChange={() => handleRatingCheckboxChange(4)}
                                                        checked={filterData.rating.includes(4)}
                                                    /> 
                                                    4 
                                                    <Rating
                                                        name="simple-controlled"
                                                        size="small"
                                                        value={4}
                                                    />
                                                    & above 
                                                </div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={3} 
                                                        onChange={() => handleRatingCheckboxChange(3)}
                                                        checked={filterData.rating.includes(3)}
                                                    /> 
                                                    3 
                                                    <Rating
                                                        name="simple-controlled"
                                                        size="small"
                                                        value={3}
                                                    />
                                                    & above 
                                                </div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={2} 
                                                        onChange={() => handleRatingCheckboxChange(2)}
                                                        checked={filterData.rating.includes(2)}
                                                    /> 
                                                    2 
                                                    <Rating
                                                        name="simple-controlled"
                                                        size="small"
                                                        value={2}
                                                    />
                                                    & above 
                                                </div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={1} 
                                                        onChange={() => handleRatingCheckboxChange(1)}
                                                        checked={filterData.rating.includes(1)}
                                                    /> 
                                                    1 
                                                    <Rating
                                                        name="simple-controlled"
                                                        size="small"
                                                        value={1}
                                                    />
                                                    & above 
                                                </div>
                                            </div>
                                        }
                                        {/* price section */}
                                        {filterTab === 'price' &&
                                            <div>
                                                <div className='fw-bold'>Price:</div>
                                                <div className='d-flex flex-column align-items-center justify-content-center gap-2 mt-3'>
                                                    <div>
                                                        <ButtonGroup variant="outlined" className='mt-1' aria-label="Basic button group">
                                                            <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                                                setFilterData({
                                                                    ...filterData,
                                                                    price: [filterData?.price[0] - 1, filterData?.price[1]]
                                                                })
                                                            }}><RemoveIcon fontSize='small' /></Button>
                                                            <Button sx={{ width: '60px' }} className='border-primary text-primary'>₹ {filterData?.price[0]}</Button>
                                                            <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                                                setFilterData({
                                                                    ...filterData,
                                                                    price: [filterData?.price[0] + 1, filterData?.price[1]]
                                                                })
                                                            }}><AddIcon fontSize='small' /></Button>
                                                        </ButtonGroup>
                                                    </div>
                                                    <Slider
                                                        getAriaLabel={() => 'Temperature range'}
                                                        value={filterData?.price}
                                                        onChange={(e,val)=>setFilterData({
                                                            ...filterData,
                                                            price:val
                                                        })}
                                                        valueLabelDisplay="auto"
                                                        min={50}
                                                        max={10000}
                                                        getAriaValueText={valuetext}
                                                    />
                                                    <div>
                                                        <ButtonGroup variant="outlined" className='mt-1' aria-label="Basic button group">
                                                            <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                                                setFilterData({
                                                                    ...filterData,
                                                                    price: [filterData?.price[0], filterData?.price[1] - 1]
                                                                })
                                                            }}><RemoveIcon fontSize='small' /></Button>
                                                            <Button sx={{ width: '60px' }} className='border-primary text-primary'>₹ {filterData?.price[1]}</Button>
                                                            <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                                                setFilterData({
                                                                    ...filterData,
                                                                    price: [filterData?.price[0], filterData?.price[1] + 1]
                                                                })
                                                            }}><AddIcon fontSize='small' /></Button>
                                                        </ButtonGroup>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {/* discount section */}
                                        {filterTab === 'discount' &&
                                            <div>
                                                <div className='fw-bold'>Discount:</div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={90} 
                                                        onChange={() => handleDiscountCheckboxChange(90)}
                                                        checked={filterData.discount.includes(90)}
                                                    /> 
                                                    90%
                                                </div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={80} 
                                                        onChange={() => handleDiscountCheckboxChange(80)}
                                                        checked={filterData.discount.includes(80)}
                                                    /> 
                                                    80%
                                                </div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={70} 
                                                        onChange={() => handleDiscountCheckboxChange(70)}
                                                        checked={filterData.discount.includes(70)}
                                                    /> 
                                                    70%
                                                </div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={60} 
                                                        onChange={() => handleDiscountCheckboxChange(60)}
                                                        checked={filterData.discount.includes(60)}
                                                    /> 
                                                    60%
                                                </div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={50} 
                                                        onChange={() => handleDiscountCheckboxChange(50)}
                                                        checked={filterData.discount.includes(50)}
                                                    /> 
                                                    50%
                                                </div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={40} 
                                                        onChange={() => handleDiscountCheckboxChange(40)}
                                                        checked={filterData.discount.includes(40)}
                                                    /> 
                                                    40%
                                                </div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={30} 
                                                        onChange={() => handleDiscountCheckboxChange(30)}
                                                        checked={filterData.discount.includes(30)}
                                                    /> 
                                                    30%
                                                </div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={20} 
                                                        onChange={() => handleDiscountCheckboxChange(20)}
                                                        checked={filterData.discount.includes(20)}
                                                    /> 
                                                    20%
                                                </div>
                                                <div className='d-flex align-items-center gap-1'>
                                                    <Checkbox 
                                                        value={10} 
                                                        onChange={() => handleDiscountCheckboxChange(10)}
                                                        checked={filterData.discount.includes(10)}
                                                    /> 
                                                    10%
                                                </div>
                                            </div>
                                        }
                                        {/* sort by section */}
                                        {filterTab === 'sortBy' &&
                                            <div>
                                                <div className='fw-bold'>Sort by:</div>
                                                <FormControl>
                                                    <RadioGroup
                                                        aria-label="filter-sort-by"
                                                        name="filterSortBy"
                                                        value={filterData?.sortBy}
                                                        onChange={(e)=>setFilterData({
                                                            ...filterData,
                                                            sortBy: e.target.value
                                                        })}
                                                    >
                                                        <FormControlLabel name='filterSortBy' value="Newest First" control={<Radio />} label="Newest First" />
                                                        <FormControlLabel name='filterSortBy' value="Price Low to High" control={<Radio />} label="Price Low to High" />
                                                        <FormControlLabel name='filterSortBy' value="Price High to Low" control={<Radio />} label="Price High to Low" />
                                                        <FormControlLabel name='filterSortBy' value="Popularity" control={<Radio />} label="Popularity" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div>&nbsp;</div>
                                    <div className='d-flex align-items-center gap-3'>
                                        <Button type='button' variant="contained" className='px-5 mt-2 rounded-0' size='small' color='error' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                                            setFilterData({
                                                rating: [],
                                                price: [20,5000],
                                                discount: [],
                                                sortBy: '',
                                            })
                                            setList(products?.data)
                                        }}>Clear</Button>
                                        <Button type='button' variant="contained" className='px-5 mt-2 rounded-0 bg-button-primary' size='small' data-bs-dismiss="offcanvas" aria-label="Close" onClick={applyFilter}>Apply</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default SelectedSubCategoryProducts