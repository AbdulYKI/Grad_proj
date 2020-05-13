// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/api/",
  logo: "../assets/icons/logo.png",
  profileUploaderLoadingSvg: "../assets/svg-loaders/rings.svg",
  editorLoadingSvg: "../assets/svg-loaders/oval.svg",
  fbLogo: "../assets/icons/facebook.png",
  googleLogo: "../assets/icons/google.png",
  instagramLogo: "../assets/icons/instagram.png",
  defaultPhoto: "../assets/icons/user.png",
  tokenName: "gradProjToken",
  langAr: "../assets/langIcons/arFlag.png",
  langEn: "../assets/langIcons/enFlag.png",
};
export function tokenGetter() {
  return localStorage.getItem(environment.tokenName);
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
