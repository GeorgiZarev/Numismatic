import React, { useContext} from "react";
import { createShopContext } from "../../Contexts/createContex";
import GridForHeader from '../Partial/GridForHeader.jsx'
import Title from "./TitleGrid";

const CatalogGrid = () => {

    const { products } = useContext(createShopContext);

    return (
        <div className="my-10">
            <div className="text-center pb-[1rem] pt-[2rem] text-3xl">
                <Title text1={'OUR'} text2={'COINS'}/>
                <p className="pt-serif-regular w-3/4 m-auto pb-[3rem] text-xs sm:text-sm md:text-base text-gray-500">
                   {/*TODO put some text here */} Put some text here ...
                </p>
                
                
                <GridForHeader />
            </div>
        </div>
    );
};

export default CatalogGrid;