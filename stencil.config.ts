import { Config } from '@stencil/core';
import { angularOutputTarget } from '@stencil/angular-output-target';

const ANGULAR_LIB = 'angular/projects/mcaap-onboarding/src/lib/stencil-generated';

export const config: Config = {
  namespace: 'mcaap-onboarding',
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    { type: 'dist-custom-elements', customElementsExportBehavior: 'auto-define-custom-elements' },
    // Angular wrapper: generates standalone proxy components that self-register the
    // custom element (includeImportCustomElements), so no defineCustomElements() call needed.
    angularOutputTarget({
      componentCorePackage: 'mcaap-onboarding',
      outputType: 'standalone',
      includeImportCustomElements: true,
      directivesProxyFile: `${ANGULAR_LIB}/components.ts`,
      directivesArrayFile: `${ANGULAR_LIB}/index.ts`,
    }),
    { type: 'www', serviceWorker: null },
  ],
};
