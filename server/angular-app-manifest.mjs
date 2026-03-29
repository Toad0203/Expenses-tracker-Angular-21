
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Expenses-tracker-Angular-21/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/Expenses-tracker-Angular-21"
  },
  {
    "renderMode": 2,
    "route": "/Expenses-tracker-Angular-21/review"
  },
  {
    "renderMode": 2,
    "route": "/Expenses-tracker-Angular-21/personalize"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 11491, hash: '97d09e1ef424ecea549214c8cbdeeff1bb25ff350018b3f2434d7b91d18e3041', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 11822, hash: '876a8dba321ed50a961406fc3e877e25d69a6951662abe3c5b17500c9e5af11e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 22732, hash: 'e456963fa2ec6318672928951dec686538886572daba5c3a506a9a9eafa576f8', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'review/index.html': {size: 17929, hash: 'f7dc3e34fab1b265c5a2e7fef9789ab86a9f8fdc8aad9e7923da65e79d84a86f', text: () => import('./assets-chunks/review_index_html.mjs').then(m => m.default)},
    'personalize/index.html': {size: 20491, hash: 'edfcc579d2b694120ecefcf8d65de44ab22f920103f4cde0638544ae9aa7b1fc', text: () => import('./assets-chunks/personalize_index_html.mjs').then(m => m.default)},
    'styles-N7447XCK.css': {size: 63, hash: 'alQp5kXXW3A', text: () => import('./assets-chunks/styles-N7447XCK_css.mjs').then(m => m.default)}
  },
};
