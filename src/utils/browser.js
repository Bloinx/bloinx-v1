/* eslint-disable import/prefer-default-export */
export function getUrlParams(search) {
  let params;
  const newSearch = search.replace("?", "");
  const paramsList = newSearch.split("&");
  paramsList.forEach((param) => {
    const data = param.split("=");
    params = {
      ...params,
      [data[0]]: data[1],
    };
  });
  return params;
}

export function iOS() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}
