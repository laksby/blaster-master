import type { GatsbyConfig } from 'gatsby';
import { paths } from './src/constants';

const config: GatsbyConfig = {
  pathPrefix: paths.GATSBY_PATH_PREFIX,
  siteMetadata: {
    title: 'laksby',
    siteUrl: 'https://laksby.github.io/sandbox/',
  },
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-postcss',
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/data`,
      },
    },
  ],
};

export default config;
