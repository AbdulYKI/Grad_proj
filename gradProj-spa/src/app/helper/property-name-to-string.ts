export class PropertyNameFinder {
  static res = "";
  static propertyNameToString(testObject, propertyValue): string {
    // tslint:disable-next-line: forin
    for (const propertyName in testObject) {
      if (testObject[propertyName] === propertyValue) {
        this.res = propertyName;
        return this.res;
      } else {
        if (typeof testObject[propertyName] === "object") {
          if (
            this.propertyNameToString(testObject[propertyName], propertyValue)
          ) {
            return this.res;
          }
        }
      }
      return undefined;
    }
  }
}
