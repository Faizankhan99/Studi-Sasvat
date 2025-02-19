/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../../Components/Layout/Navbar'
import FreeModeSwiper from '../../Components/Swiper/FreeModeSwiper'
import ProductSwiper from '../../Components/Swiper/ProductSwiper'
import FavoriteIcon from '@mui/icons-material/Favorite';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Link, useNavigate } from 'react-router-dom';
import BottomNavigation from '../../Components/Layout/BottomNavigation';
import PlainSwiper from '../../Components/Swiper/PlainSwiper';
import { Button, IconButton, Rating, styled, Tooltip } from '@mui/material';
import FullPageLoader from '../../Components/Loaders/FullPageLoader';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { getBestSellingProducts, getProducts, resetProductState } from '../../Features/Product/ProductSlice';
import { createWishlist, getWishlists, resetWishlistState } from '../../Features/Wishlist/WishlistSlice';
import BannerPlainSwiper from '../../Components/Swiper/BannerPlainSwiper';
import { fetchAllCategoryWithProducts, getCategories, resetCategoryState } from '../../Features/Category/CategorySlice';
import { getMainBanners, resetMainBannerState } from '../../Features/MainBanner/MainBannerSlice';
import { getSecondaryBanners, resetSecondaryBannerState } from '../../Features/SecondaryBanner/SecondaryBannerSlice';
import CategorySwiper from '../../Components/Swiper/CategorySwiper';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { motion, useInView } from 'framer-motion'



const GlowButton = styled(Button)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    transform: 'translate3d(0, 0, 0)',
    backgroundColor: '#22696b',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1a5457',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'rotate(45deg)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '&:hover::before': {
      left: '-100%',
      top: '-100%',
    },
  }));

const Home = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [list, setList] = useState([])
    const [bestSellingProductList, setBestSellingProductList] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [categoryWithProductList, setCategoryWithProductList] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [wishListArray, setWishListArray] = useState([])
    const [mainBannerArray, setSecondaryBannerArray] = useState([])
    const [secondaryBannerArray, setMainBannerArray] = useState([])
    const [renderNavCart, setRenderNavCart] = useState(false)
    const [renderNavWishlist, setRenderNavWishlist] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [showVideoAsTheme, setShowVideoAsTheme] = useState(false)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false })

    const { products, responseStatus, responseMessage } = useSelector(state => state.products)
    const { categories, responseStatus: categoryResponseStatus, responseMessage: categoryResponseMessage } = useSelector(state => state.categories)
    const { wishlists, responseStatus: wishlistResponseStatus, responseMessage: wishlistResponseMessage } = useSelector(state => state.wishlists)
    const { mainBanners, responseStatus: mainBannerResponseStatus, responseMessage: mainBannerResponseMessage } = useSelector(state => state.mainBanners)
    const { secondaryBanners, responseStatus: secondaryBannerResponseStatus, responseMessage: secondaryBannerResponseMessage } = useSelector(state => state.secondaryBanners)

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

    useEffect(()=>{
        const user = Cookies.get('studioSasvatLoggedInUser')
        const token = Cookies.get('studioSasvatLoggedInUserToken')

        if (user && token) {
            setIsLoggedIn(true)
        }
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);

        localStorage.removeItem('/all-products')
        localStorage.removeItem(`/studio-sasvat/ordersSearchFilter`)
        localStorage.removeItem(`/studio-sasvat/productsSearchFilter`)
        localStorage.removeItem('/studio-sasvat/products')
        localStorage.removeItem('/related-products')
        localStorage.removeItem('/category-product')
        localStorage.removeItem('/sub-category-product')
    },[])

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getBestSellingProducts());
        dispatch(getCategories());
        dispatch(fetchAllCategoryWithProducts());
        dispatch(getMainBanners());
        dispatch(getSecondaryBanners());
    }, [dispatch]);

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'Get All'){
            setList(products?.data)
            dispatch(getWishlists());
        }
        if(responseStatus == 'success' && responseMessage == 'Get All Best Selling Products'){
            setBestSellingProductList(products?.data)
            dispatch(getWishlists());
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
        if(categoryResponseStatus == 'success' && categoryResponseMessage == 'Get All'){
            setCategoryList(categories?.data)
        }
        if(categoryResponseStatus == 'success' && categoryResponseMessage == 'Get All Categories with their Products'){
            setCategoryWithProductList(categories?.data)
        }
        if(categoryResponseStatus == 'rejected' && categoryResponseMessage != '' && categoryResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: categoryResponseMessage
            });
            setTimeout(() => {
                dispatch(resetCategoryState())
            }, 1000);
        }
    },[categories, categoryResponseStatus, categoryResponseMessage])

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

    useEffect(()=>{
        if(mainBannerResponseStatus == 'success' && mainBannerResponseMessage == 'Get All'){
            setMainBannerArray(mainBanners?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(mainBannerResponseStatus == 'rejected' && mainBannerResponseMessage != '' && mainBannerResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: mainBannerResponseMessage
            });
            setTimeout(() => {
                dispatch(resetMainBannerState())
            }, 1000);
        }
    },[mainBanners, mainBannerResponseStatus, mainBannerResponseMessage])

    useEffect(()=>{
        if(secondaryBannerResponseStatus == 'success' && secondaryBannerResponseMessage == 'Get All'){
            setSecondaryBannerArray(secondaryBanners?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(secondaryBannerResponseStatus == 'rejected' && secondaryBannerResponseMessage != '' && secondaryBannerResponseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: secondaryBannerResponseMessage
            });
            setTimeout(() => {
                dispatch(resetSecondaryBannerState())
            }, 1000);
        }
    },[secondaryBanners, secondaryBannerResponseStatus, secondaryBannerResponseMessage])

    return (
        <>
            { fullPageLoading && <FullPageLoader /> }
            <Navbar renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
            
            
            <div className="w-100">
                <BannerPlainSwiper data={mainBanners?.data} />
            </div>
            <div className="container-fluid">
                <div className='row mt-3'>
                    <div className="col-md-12 p-0">
                        <div className="container">
                            <div className='mb-1 d-flex flex-wrap align-items-center justify-content-between gap-1 new-arrival-sm-heading-section'>
                                <h6 className='text-secondary'>MOST POPULAR</h6>
                                <Button type='button' variant="text" className='text-primary' size='small' onClick={()=>navigate('/all-products')}>Show All <TrendingFlatIcon fontSize='small' /></Button>
                            </div>
                            <div className='text-primary fst-italic d-flex flex-nowrap align-items-baseline gap-3 new-arrival-heading-section'>
                                <img src="/logoFinal2.png" className='logo-with-heading' alt="/logoFinal2.png" /> 
                                <div className='new-arrival-heading'>Discover the Latest Additions at Your Top Choice Crafts Shop</div>
                            </div>
                            <div className="row mt-4">
                                {
                                    Array?.isArray(list) && list?.map((val, key) => (
                                        <div key={key} className="col-lg-4 col-md-6 col-sm-6 product-card mb-5">
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
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-100 p-5 mt-5" style={{ backgroundImage: 'url(/jewelBg.jpg)', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-9">
                            <center><h3 className='text-white mb-5 text-uppercase fst-italic fw-bold new-arrival-heading'>Shop The Latest</h3></center>
                            <center>
                                <div className='border border-white'>
                                    {
                                        !showVideoAsTheme ?
                                        <div className='theme-image-lg' style={{ backgroundImage: `url(${list[0]?.productImageUrl})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} onMouseEnter={()=>setShowVideoAsTheme(true)}></div>
                                        :
                                        <div className='theme-image-lg'  onMouseLeave={()=>setShowVideoAsTheme(false)}>
                                            <video
                                                className='theme-image-lg'
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    zIndex: 1
                                                }}
                                                src={list[0]?.productVideoUrl}
                                                autoPlay
                                                muted
                                                loop
                                            />
                                        </div>
                                    }
                                </div>
                            </center>
                        </div>
                        <div className="col-md-3 d-flex flex-column align-items-center justify-content-between">
                            <div>&nbsp;</div>
                            <div className='border border-white'>
                                <center>
                                    <img src={list[0]?.featuredImage[0]?.featuredImageUrl} className='w-75' alt={list[0]?.featuredImage[0]?.featuredImageUrl} />
                                </center>
                                <center><div className='text-white fs-6 py-2'>{list[0]?.productName}</div></center>
                                <center><div className='text-white pb-2'><span style={{ fontSize: '12px' }}><del>₹{(list[0]?.price / (1 - (list[0]?.discount / 100)))?.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</del></span> <span className='fs-5'>₹{list[0]?.price}</span></div></center>
                                <Button type='button' variant='outlined' className='border border-white text-white w-100 rounded-0' onClick={()=>navigate(`/product-detail/${list[0]?._id}`)}><i className="fa-solid fa-bag-shopping"></i>&nbsp;&nbsp;Add to Cart</Button>
                            </div>
                            <div>&nbsp;</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="w-100 category-with-product-section">
                <div className="container">
                    <FreeModeSwiper data={secondaryBanners?.data} />
                </div>
            </div>
            
            {
                Array?.isArray(categoryWithProductList) && categoryWithProductList?.length > 0 ?
                    Array?.isArray(categoryWithProductList) &&  categoryWithProductList?.map((val,key)=>(
                        <div className={`container ${ key > 5 || val?.products?.length == 0 ? 'd-none' : '' } category-with-product-section`}>
                            <div className="row">
                                <div className='mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3'>
                                    <h3 className='text-primary'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> {val?.categoryName}</h3>
                                    <Button type='button' variant="text" className='text-primary' size='small' onClick={()=>navigate(`/category-product/${val?._id}`)}>Show All <TrendingFlatIcon fontSize='small' /></Button>
                                </div>
                                {
                                    Array?.isArray(val?.products) && val?.products?.map((product, childKey) =>(
                                        <div key={childKey} className={`col-lg-4 col-md-6 col-sm-6 product-card mb-5 ${childKey > 5 ? 'd-none' : ''}`}>
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
                                                    {hoveredIndex === key && product?.productVideoUrl && product?.productVideoUrl != '' ? (
                                                        <video
                                                            src={product?.productVideoUrl}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            autoPlay
                                                            loop
                                                            muted
                                                        />
                                                    ) : (
                                                        <div 
                                                            style={{ 
                                                                backgroundImage: `url(${product?.productImageUrl})`, 
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
                                                            <span onClick={() => navigate(`/product-detail/${product?._id}`)}>{product?.categoryName}</span>
                                                            <div>
                                                                <Tooltip title={wishListArray?.some(wishlistProduct => wishlistProduct?.productId == product?._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                                                                    <IconButton onClick={() => handleWishlist(product)}>
                                                                        {wishListArray?.some(wishlistProduct => wishlistProduct?.productId == product?._id) ?
                                                                            <FavoriteIcon role='button' className='text-red' />
                                                                            :
                                                                            <FavoriteBorderIcon role='button' className='text-secondary' />
                                                                        }
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title='Add to Cart' onClick={() => navigate(`/product-detail/${product?._id}`)}>
                                                                    <IconButton onClick={() => handleWishlist(product)}>
                                                                        <ShoppingCartOutlinedIcon role='button' className='text-secondary' />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='fw-bold text-dark product-card-product-name fst-italic text-primary mb-0 product-card-product-name' style={{ letterSpacing: '0', fontFamily: 'Cardamon, serif' }} onClick={() => navigate(`/product-detail/${product?._id}`)}>
                                                        {product?.productName?.length > 20 ? `${product?.productName?.substring(0, 20)}...` : product?.productName}
                                                    </div>
                                                    <div className='d-flex align-items-center justify-content-between mb-0' onClick={() => navigate(`/product-detail/${product?._id}`)}>
                                                        <Rating name="size-small" value={product?.currentRating} precision={0.5} size="small" />
                                                    </div>
                                                    <div className='d-flex align-items-center gap-3 product-card-product-price' onClick={() => navigate(`/product-detail/${product?._id}`)}>
                                                        <span className='fw-bold text-primary' onClick={() => navigate(`/product-detail/${product?._id}`)}>₹{product?.price}</span>
                                                        <small className='text-secondary fw-bold'><del>₹{(product?.price / (1 - (product?.discount / 100)))?.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</del></small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                : ''
            }

            <div className="w-100" style={{ margin: '50px 0 80px 0' }}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 px-4" style={{ padding: '50px 0', backgroundImage: `url(/darkBg7.jpg)`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
                            <center>
                                <div className='text-white mt-3 fst-italic new-arrival-heading mobile-light-shadow'>Why Studio Sasvat ?</div>
                                <div className='text-white content-padding mobile-light-shadow' style={{ fontSize: '18px', margin: '60px 0' }}>
                                    Your ultimate destination for exquisite art and unique decor pieces. Our collection is meticulously curated to inspire and transform your living spaces with creativity and elegance. We believe that every home should reflect the personality and taste of its owner, and our wide range of products is designed to do just that.
                                    <span className='site-content'>
                                        From stunning paintings and sculptures to innovative decor accessories, our offerings are a perfect blend of artistry and craftsmanship. Each piece in our collection is selected for its quality and uniqueness, ensuring that you find something truly special for your home.
                                        
                                        Whether you are looking to add a touch of sophistication to your living room, bring warmth to your bedroom, or make a bold statement in your office, Studio Sasvat has something for every style and space. We are dedicated to helping you create an environment that not only looks beautiful but also feels like home.

                                        Discover the joy of decorating with our diverse range of products and let your decor journey begin. Shop now and transform your space into a haven of beauty and inspiration.
                                    </span>
                                </div>
                                <Button type='button' variant='contained' className='bg-white text-dark rounded-0 px-5' onClick={()=>navigate(`/all-products`)}>Shop Now</Button>
                            </center>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid category-with-product-section">
                <div className="container">
                    <div className="row">
                        <div className='mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3'>
                            <h3 className='text-primary'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> Shop by Category</h3>
                            <Button type='button' variant="text" className='text-primary' size='small' onClick={()=>navigate('/all-categories')}>Show All <TrendingFlatIcon fontSize='small' /></Button>
                        </div>
                        <div className='text-center mb-4 fs-5 site-content'>"Explore our wide range of products in the Shop by Category section, designed to help you find exactly what you’re looking for with ease. Whether you're searching for the latest in home decor, stylish fashion accessories, or unique handcrafted items, we’ve organized everything into categories to make your shopping experience seamless."</div>
                        <CategorySwiper data={categoryList && categoryList?.length > 0 ? categoryList : []} />
                    </div>
                </div>
            </div>

            <div className="w-100 category-with-product-section">
                <div className="container-fluid">
                    <div className='row' style={{ backgroundImage: `url(/darkBg6.jpg)`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
                        <div className="col-md-12 d-flex flex-column align-items-center justify-content-center" style={{ padding: '80px 15px' }}>
                            <div className='fst-italic new-arrival-heading text-white text-center'>For Our All Valuable Customer!</div>
                            <small className='fst-italic text-center text-white content-padding' style={{ fontSize: '18px', margin: '60px 0' }}>
                                For every occasion, every style, and every moment that matters, Studio Sasvat’s stunning products are designed to bring a touch of elegance and charm to your life. Whether you are preparing for a special celebration, dressing up for an important event, decorating your home, or simply looking to enhance your everyday life with something extraordinary, Studio Sasvat has the perfect piece to match your needs and desires.
                                <span className='site-content'>
                                    <br />
                                    At Studio Sasvat, we believe that life’s moments, big or small, deserve to be adorned with beauty, sophistication, and grace. Our carefully curated collection is designed to evoke a sense of timeless elegance, blending modern aesthetics with the deep-rooted traditions of exquisite craftsmanship. Every piece tells a story — a story of passion, creativity, and artistry that resonates with the hearts of those who value the finer things in life.
                                
                                    Whether you're searching for a delicate, hand-crafted piece of jewelry to wear on your wedding day, a striking decorative item to gift a loved one on their birthday, or an elegant accessory to make a statement at a formal event, our collection has something that will leave a lasting impression. Our products are not just items; they are symbols of thoughtfulness, care, and the joy of giving and receiving.
                                </span>
                            </small>
                            <Button type='button' variant='contained' className='bg-white text-dark rounded-0' endIcon={<ArrowRightAltOutlinedIcon fontSize='large' />} onClick={()=>navigate(`/product-detail/${list[2]?._id}`)}>Explore Now</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <ProductSwiper /> */}
            <div className="w-100 mt-0 bg-footer pt-2 pb-4">
                <div className="container">
                    <div className='row mt-5'>
                        <h3 className='text-primary mb-4'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> Best selling</h3>
                        <div className='text-center mb-4 fs-5 site-content'>"Discover our most popular products in the Best Selling section, where customer favorites come together in one place. From must-have accessories and stylish home decor to trending fashion pieces and innovative gadgets, these top-selling items are loved for their quality, style, and value."</div>
                        {
                            Array?.isArray(bestSellingProductList) && bestSellingProductList?.map((val, key) => (
                                <div key={key} className={`col-lg-4 col-md-6 col-sm-6 product-card mb-5 ${key > 5 ? 'd-none' : ''}`}>
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
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row mt-5">
                    <h3 className='text-primary text-center mb-3'><img src="/logoFinal2.png" style={{ height: '25px' }} alt="/logoFinal2.png" /> Services</h3>
                    <div className="col-md-4">
                        <Button type='button' className='w-100 py-3 px-2 mb-3 border-primary text-primary' variant="outlined" size='small'>
                            <center>
                                <img src="/uniqueProducts.png" style={{ height: '100px' }} alt="/uniqueProducts.png"/>
                                <div className='text-center fs-5'>Unique & Genuine Products</div>
                            </center>
                        </Button>
                    </div>
                    <div className="col-md-4">
                        <Button type='button' className='w-100 py-3 px-2 mb-3 border-primary text-primary' variant="outlined" size='small'>
                            <center>
                                <img src="/homeDeliveryService.png" style={{ height: '100px' }} alt="/homeDeliveryService.png"/>
                                <div className='text-center fs-5'>Quick Home Delivery</div>
                            </center>
                        </Button>
                    </div>
                    <div className="col-md-4">
                        <Button type='button' className='w-100 py-3 px-2 mb-3 border-primary text-primary' variant="outlined" size='small'>
                            <center>
                                <img src="/openBoxDeliveryService.png" style={{ height: '100px' }} alt="/openBoxDeliveryService.png"/>
                                <div className='text-center fs-5'>Exclusive Discounts</div>
                            </center>
                        </Button>
                    </div>
                </div>
            </div>
            <BottomNavigation renderNavCart={renderNavCart} setRenderNavCart={setRenderNavCart} renderNavWishlist={renderNavWishlist} setRenderNavWishlist={setRenderNavWishlist} />
        </>
    )
}

export default Home