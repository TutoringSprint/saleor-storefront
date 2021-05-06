import { GetServerSideProps } from "next";

import { CategoryView, CategoryViewProps } from "@temp/views/Category";
import {
  getFeaturedProducts,
  getSaleorApi,
  getShopAttributes,
} from "@utils/ssr";

export default CategoryView;

export const getServerSideProps: GetServerSideProps<
  CategoryViewProps,
  CategoryViewProps["params"]
> = async context => {
  const { params } = context;
  const slug = params.slug as string;
  let data = null;
  const { api } = await getSaleorApi();
  const { data: details } = await api.categories.getDetails({ slug });

  if (details) {
    const { id } = details;

    const [attributes, featuredProducts, ancestors] = await Promise.all([
      getShopAttributes({ categoryId: id }),
      getFeaturedProducts(),
      api.categories.getAncestors({ first: 5, id }).then(({ data }) => data),
    ]);
    data = {
      details,
      ancestors,
      featuredProducts,
      attributes,
      id,
    };
  }
  return {
    props: { data: data || null, params },
  };
};
