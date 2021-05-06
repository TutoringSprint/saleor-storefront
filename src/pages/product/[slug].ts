import { VariantAttributeScope } from "@saleor/sdk";
import { GetServerSideProps } from "next";

import { channelSlug } from "@temp/constants";
import { getSaleorApi } from "@utils/ssr";

import { ProductPage, ProductPageProps } from "../../views/Product";

export default ProductPage;

export const getServerSideProps: GetServerSideProps<
  ProductPageProps,
  ProductPageProps["params"]
> = async context => {
  const { params } = context;
  const { api } = await getSaleorApi();
  const { data } = await api.products.getDetails({
    slug: params.slug as string,
    channel: channelSlug,
    variantSelection: VariantAttributeScope.VARIANT_SELECTION,
  });
  return {
    props: { data: data || null, params },
  };
};
