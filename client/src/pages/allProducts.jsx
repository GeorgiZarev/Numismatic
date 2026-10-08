import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiChevronRight } from "react-icons/fi";
import { useShopCatalog } from "../hooks/useShopCatalog";
import ShopFilters from "../components/shop/ShopFilters";
import ShopToolbar from "../components/shop/ShopToolbar";
import ShopProductCard from "../components/shop/ShopProductCard";
import { shopTitleKey } from "../utils/shopFilters";

const AllProducts = () => {
  const { t } = useTranslation();
  const catalog = useShopCatalog();
  const sort = catalog.filters.sort && catalog.filters.order
    ? `${catalog.filters.sort}-${catalog.filters.order}` : "";
  const title = t(shopTitleKey(catalog.filters.product_type));
  const isCategory = catalog.filters.product_type !== "all";

  return (
    <main className="mx-auto max-w-[1500px] pb-20 pt-6 sm:pt-9">
      <nav aria-label={t("shop.breadcrumb")} className="flex flex-wrap items-center gap-2 text-xs text-[#607168]">
        <Link to="/" className="hover:text-[#173d34] hover:underline">{t("nav.home")}</Link>
        <FiChevronRight aria-hidden="true" />
        <Link to="/all-products" className="hover:text-[#173d34] hover:underline">{t("shop.shop")}</Link>
        <FiChevronRight aria-hidden="true" />
        {isCategory ? (
          <>
            <Link to="/all-products" className="hover:text-[#173d34] hover:underline">{t("shop.allItems")}</Link>
            <FiChevronRight aria-hidden="true" />
          </>
        ) : null}
        <span className="text-[#243b33]" aria-current="page">{title}</span>
      </nav>

      <h1 className="mb-8 mt-8 font-serif text-[32px] font-semibold leading-tight text-[#132e28] sm:mb-10 sm:mt-10 sm:text-[40px]">
        {title}
      </h1>

      <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] xl:gap-10 xl:grid-cols-[270px_minmax(0,1fr)]">
        <ShopFilters filters={catalog.filters} onChange={catalog.updateFilter} onReset={catalog.resetFilters} />

        <div className="min-w-0">
          <ShopToolbar
            search={catalog.filters.search}
            onSearch={(value) => catalog.updateFilter("search", value)}
            sort={sort}
            onSort={catalog.updateSort}
            count={catalog.products.length}
            pageSize={catalog.pageSize}
            onPageSize={catalog.changePageSize}
            view={catalog.view}
            onView={catalog.setView}
          />

          {catalog.isLoading && <p role="status" className="py-12 text-[#52645b]">{t("shop.loading")}</p>}
          {catalog.isError && <p role="alert" className="py-12 text-red-700">{catalog.error?.message || t("shop.loadError")}</p>}
          {!catalog.isLoading && !catalog.isError && catalog.products.length === 0 && (
            <p className="py-12 text-[#52645b]">{t("shop.noResults")}</p>
          )}

          {!catalog.isLoading && !catalog.isError && catalog.pageProducts.length > 0 && (
            <div className={`grid gap-4 sm:gap-5 ${catalog.view === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3"}`}>
              {catalog.pageProducts.map((product) => <ShopProductCard key={product.id} product={product} view={catalog.view} />)}
            </div>
          )}

          {!catalog.isLoading && !catalog.isError && catalog.pageCount > 1 && (
            <nav aria-label={t("shop.pages")} className="mt-9 flex items-center justify-center gap-3">
              <button type="button" disabled={catalog.page === 1} onClick={() => { catalog.setPage((page) => page - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="min-h-11 border border-[#cdd5d1] px-4 text-sm text-[#20312e] hover:bg-[#eef3f0] disabled:opacity-40">{t("shop.previous")}</button>
              <span className="text-sm text-[#52645b]">{t("shop.pageOf", { page: catalog.page, count: catalog.pageCount })}</span>
              <button type="button" disabled={catalog.page === catalog.pageCount} onClick={() => { catalog.setPage((page) => page + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="min-h-11 border border-[#cdd5d1] px-4 text-sm text-[#20312e] hover:bg-[#eef3f0] disabled:opacity-40">{t("shop.next")}</button>
            </nav>
          )}
        </div>
      </div>
    </main>
  );
};

export default AllProducts;
