import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import './App.css';
import Cart from './pages/cart';
import Home from './pages/home';
import Login from './pages/login';
import {useAuth} from './firebase/auth'
import { ACTION, useDispatch, useSelector } from './store';

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useLocation } from 'react-router-dom';
import { getItemCount } from './utils';
import Checkout from './pages/checkout';

function App() {
  return (<Routes>
    <Route element={<Layout />}>
      <Route path='/' element={<Home />}></Route>
      <Route path='/cart' element={<Cart />}></Route>
      <Route path='/checkout' element={<Checkout />}></Route>
      <Route path='/login' element={<Login/>} />
    </Route>
  </Routes>


  );
}

function CartInfo(props) {
  const cartItems = useSelector(state => state.cart)
  const count = getItemCount(cartItems)
  return (
    <div className='cart__info'>
      <span className='count'>{count}</span>

      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="container">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>

    </div>
  )
}
function ComboBox({ items, onSelectionChange, onSearch }) {

  const [searchParams,] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("searchterm") ?? "");

  const handleChange = (event) => {
    const { value } = event.target;
    // empty value or the combobox cleared
    if (!value && searchTerm !== value) {
      onSelectionChange(value)
    }
    setSearchTerm(value);

  }

  const handleProductSelection = (productTitle) => {
    setSearchTerm(productTitle);
    onSelectionChange(productTitle)
  }
  const handleSearch = () => {
    onSearch(searchTerm)
  }



  const results = searchTerm ? items.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase())) : items;

  return <>
    <Combobox aria-label="products" onSelect={handleProductSelection} >
      <ComboboxInput
        className="city-search-input"
        onChange={handleChange}
        type="search"
        value={searchTerm}
      />
      <button onClick={handleSearch}>🔎</button>
      {results && (
        <ComboboxPopover className="shadow-popup">
          {results.length > 0 ? (
            <ComboboxList>
              {results.map((prod, index) => (
                <ComboboxOption
                  key={prod.id}
                  value={prod.title}
                />
              ))}
            </ComboboxList>
          ) : (
            <span style={{ display: "block", margin: 8 }}>
              No results found
            </span>
          )}
        </ComboboxPopover>
      )}
    </Combobox>
  </>
}

function SearchBar() {
  const [searchParams,] = useSearchParams();
  const searchTerm = searchParams.get("searchterm");
  const products = useSelector(state => state.products);
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get("category") ?? "all");
  const categories = useSelector(state => state.categories);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function fetchAllCategories() {
    const result = await fetch('https://fakestoreapi.com/products/categories')
    dispatch({ type: ACTION.ADD_CATEGORIES, payload: await result.json() });
  }

  if (!categories?.length) {
    fetchAllCategories();
  }

  const handleCategoryChange = (e) => {
    const { value: category } = e.target;
    setSelectedCategory(category);
    navigate(category === "all" ? "/" : `/?category=${category}${searchTerm ? "&searchterm=" + searchTerm : ""}`);
  }

  const handleSearchChange = (searchTerm) => {
    if (searchTerm) {
      navigate(selectedCategory === "all" ? `?searchterm=${searchTerm}` : `/?category=${selectedCategory}&searchterm=${searchTerm}`);
    } else {
      navigate(selectedCategory === "all" ? `/` : `/?category=${selectedCategory}`)
    }
  }


  return (<div className='filter'>
    <section className='filter__category'>
      <select name="category-filter" id="category-filter" onChange={handleCategoryChange} value={selectedCategory}>
        <option value="all">all</option>
        {categories?.map(category => <option key={category} value={category}>{category}</option>)}
      </select>
    </section>
    <section className='filter__text'>
      <ComboBox items={selectedCategory === "all" ? products : products?.filter(prod => prod.category === selectedCategory)}
        onSelectionChange={handleSearchChange} onSearch={handleSearchChange} />
    </section>
  </div>)
}

function Header() {
  const {user} = useAuth()
  return (<nav className='header'>
    <section className='header__title'>
      <Link to="/">
        <h2>E-Comm</h2>
      </Link>
    </section>
    <section className='header__searchbar'>
      <SearchBar />
    </section>
    <section className='header__navigation'>
      <ul className='header__navigation__links'>
        <li>
          {user ? `hello, ${user?.displayName ?? user.email}` : "Hello , sign In"}

        </li>
        <li>
          <Link to="cart">
            < CartInfo />
          </Link>

        </li>
      </ul>
    </section>

    {/* <Link to="/">Home</Link> */}
    <Link to="cart">Cart</Link>
  </nav>)
}

function Layout() {
  return (<>
    <Header />
    <main className='layout__content'>
      <Outlet />
    </main>
  </>)
}

export default App;