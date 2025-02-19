import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/FrontPages/Home'
import Footer from './Components/Layout/Footer'
import ProductDetail from './Pages/FrontPages/ProductDetail'
import Cart from './Pages/FrontPages/Cart'
import Checkout from './Pages/FrontPages/Checkout'
import Wishlist from './Pages/FrontPages/Wishlist'
import MyOrders from './Pages/FrontPages/MyOrders'
import Login from './Pages/FrontPages/Login'
import DashboardIndex from './Pages/AuthPages/Dashboard/Index'
import ProductList from './Pages/AuthPages/Product/List'
import ProductForm from './Pages/AuthPages/Product/Form'
import OrderList from './Pages/AuthPages/Orders/List'
import AllProducts from './Pages/FrontPages/AllProducts'
import MyProfile from './Pages/FrontPages/MyProfile'
import HelpCenter from './Pages/FrontPages/HelpCenter'
import RelatedProducts from './Pages/FrontPages/RelatedProducts'
import EditProfile from './Pages/FrontPages/EditProfile';
import MyOrderDetail from './Pages/FrontPages/MyOrderDetail';
import PrivacyPolicy from './Pages/FrontPages/PrivacyPolicy';
import ShippingAndDelivery from './Pages/FrontPages/ShippingAndDelivery';
import TermsAndCondition from './Pages/FrontPages/TermsAndCondition';
import ReturnAndRefundPolicy from './Pages/FrontPages/ReturnAndRefundPolicy';
import ContactUs from './Pages/FrontPages/ContactUs';
import MobileApplication from './Pages/FrontPages/MobileApplication';
import OrderDetail from './Pages/AuthPages/Orders/Detail';
import ForgetPassword from './Pages/FrontPages/ForgetPassword';
import CategoryList from './Pages/AuthPages/Category/List';
import CategoryForm from './Pages/AuthPages/Category/Form';
import AllCategories from './Pages/FrontPages/AllCategory';
import SelectedCategoryProducts from './Pages/FrontPages/SelectedCategoryProducts';
import MainBannerList from './Pages/AuthPages/MainBanner/List';
import MainBannerForm from './Pages/AuthPages/MainBanner/Form';
import SecondaryBannerList from './Pages/AuthPages/SecondaryBanner/List';
import SecondaryBannerForm from './Pages/AuthPages/SecondaryBanner/Form';
import AboutUs from './Pages/FrontPages/AboutUs';
import SubCategoryList from './Pages/AuthPages/SubCategory/List';
import SubCategoryForm from './Pages/AuthPages/SubCategory/Form';
import SelectedSubCategoryProducts from './Pages/FrontPages/SelectedSubCategoryProducts';
import SiteRatingButton from './Components/Layout/SiteRatingButton';
import UserList from './Pages/AuthPages/Users/List';
import UserAllOrders from './Pages/AuthPages/Users/Detail';
import CouponList from './Pages/AuthPages/Coupon/List';
import CouponForm from './Pages/AuthPages/Coupon/Form';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/all-categories' element={<AllCategories />} />
        <Route path='/all-products' element={<AllProducts />} />
        <Route path="/category-product/:id" element={<SelectedCategoryProducts />} />
        <Route path="/sub-category-product/:id" element={<SelectedSubCategoryProducts />} />
        <Route path="/related-products" element={<RelatedProducts />} />
        <Route path='/product-detail/:id' element={<ProductDetail />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-orders' element={<MyOrders />} />
        <Route path='/my-order-detail/:id' element={<MyOrderDetail />} />
        <Route path='/edit-profile' element={<EditProfile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forget-password' element={<ForgetPassword />} />
        <Route path='/help-center' element={<HelpCenter />} />
        <Route path='/mobile-application' element={<MobileApplication />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/shipping-and-delivery' element={<ShippingAndDelivery />} />
        <Route path='/terms-and-condition' element={<TermsAndCondition />} />
        <Route path='/return-and-refund-policy' element={<ReturnAndRefundPolicy />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/contact-us' element={<ContactUs />} />

        {/* Protected pages */}
        <Route path='/studio-sasvat/dashboard' element={<DashboardIndex />} />
        <Route path='/studio-sasvat/users' element={<UserList />} />
        <Route path='/studio-sasvat/user-detail/:id' element={<UserAllOrders />} />
        <Route path='/studio-sasvat/categories' element={<CategoryList />} />
        <Route path='/studio-sasvat/category-add' element={<CategoryForm />} />
        <Route path='/studio-sasvat/category-edit/:id' element={<CategoryForm />} />
        <Route path='/studio-sasvat/sub-categories' element={<SubCategoryList />} />
        <Route path='/studio-sasvat/sub-categories-by-category/:id' element={<SubCategoryList />} />
        <Route path='/studio-sasvat/sub-category-add' element={<SubCategoryForm />} />
        <Route path='/studio-sasvat/sub-category-edit/:id' element={<SubCategoryForm />} />
        <Route path='/studio-sasvat/products' element={<ProductList />} />
        <Route path='/studio-sasvat/product-add' element={<ProductForm />} />
        <Route path='/studio-sasvat/product-edit/:id' element={<ProductForm />} />
        <Route path='/studio-sasvat/coupons' element={<CouponList />} />
        <Route path='/studio-sasvat/coupon-add' element={<CouponForm />} />
        <Route path='/studio-sasvat/coupon-edit/:id' element={<CouponForm />} />
        <Route path='/studio-sasvat/main-banner' element={<MainBannerList />} />
        <Route path='/studio-sasvat/main-banner-add' element={<MainBannerForm />} />
        <Route path='/studio-sasvat/secondary-banner' element={<SecondaryBannerList />} />
        <Route path='/studio-sasvat/secondary-banner-add' element={<SecondaryBannerForm />} />
        <Route path='/studio-sasvat/orders' element={<OrderList />} />
        <Route path='/studio-sasvat/order-detail/:id' element={<OrderDetail />} />
      </Routes>
      <Footer />
      <SiteRatingButton />
    </>
  );
}

export default App;
