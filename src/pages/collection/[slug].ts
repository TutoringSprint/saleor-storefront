import { GetServerSideProps } from "next";

import { CollectionView, CollectionViewProps } from "@temp/views/Collection";
import {
  getFeaturedProducts,
  getSaleorApi,
  getShopAttributes,
} from "@utils/ssr";

export default CollectionView;

export const getServerSideProps: GetServerSideProps<
  CollectionViewProps,
  CollectionViewProps["params"]
> = async context => {
  const { params } = context;
  const slug = params.slug as string;
  let data = null;
  const { api } = await getSaleorApi();
  const { data: details } = await api.collections.getDetails({ slug });

  if (details) {
    const { id } = details;

    const [attributes, featuredProducts] = await Promise.all([
      getShopAttributes({ collectionId: id }),
      getFeaturedProducts(),
    ]);
    data = {
      details,
      featuredProducts,
      attributes,
      id,
    };
  }
  return {
    props: { data: data || null, params },
  };
};
