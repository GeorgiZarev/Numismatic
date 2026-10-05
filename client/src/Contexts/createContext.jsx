import { createContext } from "react";
import { products } from "../Assets/ObjFile";

export const createShopContext = createContext();

const CreateShopContextProvider = (props) => {
    
    const currency = '€';
    //const delivery_fee = 0;

    const value = {
        products , currency 
    }

    return  (
        <createShopContext.Provider value={value}>
            {props.children}
        </createShopContext.Provider>
    );

};

export default CreateShopContextProvider;
