import React, { useContext, useEffect, useState} from "react";
//import { Layout } from "antd";
import { createShopContext } from "../../Contexts/createContext.jsx";
//import GridForHeader from '../Partial/GridForHeader.jsx'
//import ProductItem from "./ProductItem.jsx";
import ProductGrid from '../Partial/ProductGrid.jsx'
import CategoryGrid from './CategoryGrid.jsx'
import Title from "./Title.jsx";

import SmallCoinCard from "../cards/SmallCoinCard.jsx";
import { Content } from "antd/es/layout/layout.js";

const CatalogGrid = () => {

    const { products } = useContext(createShopContext);
    const [catalogProducts, setCatalogProducts] = useState([]);

    useEffect(()=> {
        setCatalogProducts(products.slice(0, 10));
    },[products])

    return (
        <div className="my-10">
            <div className="text-center pb-[1rem] pt-[2rem] text-3xl">
                <Title text1={'OUR'} text2={'COINS'}/>
                <p className="pt-serif-regular w-3/4 m-auto pb-[3rem] text-xs sm:text-sm md:text-base text-gray-500">
                   {/*TODO put some text here */} Put some text here ...
                </p>
                
                {/* <GridForHeader /> */}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {/* 
                    {
                    catalogProducts.map((item, index)=>(
                        <ProductGrid key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                    }
                */}
            </div>
            <Content className="flex flex-col items-center justify-center pb-[100px]">
                <ProductGrid /> 
            </Content>
            <br />
            <CategoryGrid /> <br /> 
            {/* <SmallCoinCard /> */} 
        </div> 
    );
};

export default CatalogGrid;