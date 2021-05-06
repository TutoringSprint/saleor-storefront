import { GetServerSideProps } from "next";

import { ArticleView, ArticleViewProps } from "@temp/views/Article";
import {
  Article,
  ArticleVariables,
} from "@temp/views/Article/gqlTypes/Article";
import { articleQuery } from "@temp/views/Article/query";
import { getFeaturedProducts, getSaleorApi } from "@utils/ssr";

export default ArticleView;

export const getServerSideProps: GetServerSideProps<
  ArticleViewProps,
  ArticleViewProps["params"]
> = async context => {
  const { params } = context;
  const slug = params.slug as string;
  const { apolloClient } = await getSaleorApi();

  const [featuredProducts, article] = await Promise.all([
    getFeaturedProducts(),
    apolloClient
      .query<Article, ArticleVariables>({
        query: articleQuery,
        variables: { slug },
      })
      .then(({ data }) => data.page),
  ]);
  return {
    props: { data: { article, featuredProducts } || null, params },
  };
};
