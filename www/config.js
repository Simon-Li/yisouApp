System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  bundles: {
    "build.js": [
      "lib/main.js",
      "npm:lodash@3.10.1",
      "npm:babel-runtime@5.8.20/helpers/class-call-check",
      "npm:babel-runtime@5.8.20/helpers/to-consumable-array",
      "npm:babel-runtime@5.8.20/core-js/set",
      "npm:babel-runtime@5.8.20/core-js/array/from",
      "npm:core-js@1.1.4/library/fn/set",
      "npm:core-js@1.1.4/library/fn/array/from",
      "npm:lodash@3.10.1/index",
      "npm:core-js@1.1.4/library/modules/es6.string.iterator",
      "npm:core-js@1.1.4/library/modules/es6.object.to-string",
      "npm:core-js@1.1.4/library/modules/web.dom.iterable",
      "npm:core-js@1.1.4/library/modules/es6.set",
      "npm:core-js@1.1.4/library/modules/es7.set.to-json",
      "npm:core-js@1.1.4/library/modules/$.core",
      "npm:core-js@1.1.4/library/modules/es6.array.from",
      "github:jspm/nodelibs-process@0.1.1",
      "npm:core-js@1.1.4/library/modules/$.string-at",
      "npm:core-js@1.1.4/library/modules/$.iter-define",
      "npm:core-js@1.1.4/library/modules/es6.array.iterator",
      "npm:core-js@1.1.4/library/modules/$.iterators",
      "npm:core-js@1.1.4/library/modules/$.collection-strong",
      "npm:core-js@1.1.4/library/modules/$.collection",
      "npm:core-js@1.1.4/library/modules/$.def",
      "npm:core-js@1.1.4/library/modules/$.collection-to-json",
      "npm:core-js@1.1.4/library/modules/$.ctx",
      "npm:core-js@1.1.4/library/modules/$.to-object",
      "npm:core-js@1.1.4/library/modules/$.iter-call",
      "npm:core-js@1.1.4/library/modules/$.is-array-iter",
      "npm:core-js@1.1.4/library/modules/$.to-length",
      "npm:core-js@1.1.4/library/modules/core.get-iterator-method",
      "npm:core-js@1.1.4/library/modules/$.iter-detect",
      "github:jspm/nodelibs-process@0.1.1/index",
      "npm:core-js@1.1.4/library/modules/$.to-integer",
      "npm:core-js@1.1.4/library/modules/$.defined",
      "npm:core-js@1.1.4/library/modules/$.library",
      "npm:core-js@1.1.4/library/modules/$.redef",
      "npm:core-js@1.1.4/library/modules/$.hide",
      "npm:core-js@1.1.4/library/modules/$.has",
      "npm:core-js@1.1.4/library/modules/$.wks",
      "npm:core-js@1.1.4/library/modules/$.iter-create",
      "npm:core-js@1.1.4/library/modules/$.tag",
      "npm:core-js@1.1.4/library/modules/$",
      "npm:core-js@1.1.4/library/modules/$.unscope",
      "npm:core-js@1.1.4/library/modules/$.iter-step",
      "npm:core-js@1.1.4/library/modules/$.to-iobject",
      "npm:core-js@1.1.4/library/modules/$.species",
      "npm:core-js@1.1.4/library/modules/$.strict-new",
      "npm:core-js@1.1.4/library/modules/$.for-of",
      "npm:core-js@1.1.4/library/modules/$.is-object",
      "npm:core-js@1.1.4/library/modules/$.uid",
      "npm:core-js@1.1.4/library/modules/$.support-desc",
      "npm:core-js@1.1.4/library/modules/$.mix",
      "npm:core-js@1.1.4/library/modules/$.global",
      "npm:core-js@1.1.4/library/modules/$.fails",
      "npm:core-js@1.1.4/library/modules/$.classof",
      "npm:core-js@1.1.4/library/modules/$.a-function",
      "npm:core-js@1.1.4/library/modules/$.an-object",
      "npm:process@0.10.1",
      "npm:core-js@1.1.4/library/modules/$.property-desc",
      "npm:core-js@1.1.4/library/modules/$.shared",
      "npm:core-js@1.1.4/library/modules/$.iobject",
      "npm:core-js@1.1.4/library/modules/$.cof",
      "npm:process@0.10.1/browser"
    ]
  },

  map: {
    "babel": "npm:babel-core@5.8.23",
    "babel-runtime": "npm:babel-runtime@5.8.20",
    "core-js": "npm:core-js@1.1.4",
    "lodash": "npm:lodash@3.10.1",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@5.8.20": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@1.1.4": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:lodash@3.10.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});
