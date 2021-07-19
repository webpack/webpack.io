// RedirectWebpackPlugin won't work for URI fragments
// hence we redirect them with client side script
export default function (location) {
  // cache options were splitted into a separate page
  // see https://github.com/webpack/webpack.js.org/pull/5146
  if (
    location.pathname === '/configuration/other-options/' &&
    location.hash.startsWith('#cache')
  ) {
    return `/configuration/cache/${location.hash}`;
  }

  if (location.pathname === '/webpack/options/') {
    // target urls like /webpack/options/?option=output/filename
    const searchParams = new URLSearchParams(location.search);
    const option = searchParams.get('option') || '';
    const options = option.split('/').filter(Boolean);
    if (options.length === 0) return '/configuration/';
    return `/configuration/${options[0]}/#${options.join('').toLowerCase()}`;
  }
  return false;
}
