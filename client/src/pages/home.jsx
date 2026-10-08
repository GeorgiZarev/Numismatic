import React from 'react'
import CatalogGrid from '../components/Partial/CatalogGrid.jsx'
import HomeCategoryPanels from '../components/home/HomeCategoryPanels.jsx'

const home = () => {
  return (
    <div>
      <HomeCategoryPanels />
      <CatalogGrid />
      
    </div>
  )
}

export default home
