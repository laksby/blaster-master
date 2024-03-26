import { GatsbyNode } from 'gatsby';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = args => {
  if (args.stage === 'build-html' || args.stage === 'develop-html') {
    args.actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /pixi-filters/,
            use: args.loaders.null(),
          },
          {
            test: /@pixi\/sound/,
            use: args.loaders.null(),
          },
        ],
      },
    });
  }
};
