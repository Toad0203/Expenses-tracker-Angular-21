
export default {
  basePath: '/Expenses-tracker-Angular-21',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
