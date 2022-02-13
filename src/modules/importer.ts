import { Statement } from "../types";

const importer = (function module() {

  return {
    // imports the data as JSON during module construction.
    import(json: string): Statement[] { 
      const asObjects = JSON.parse(json);
      if (!Array.isArray(asObjects)) {
        throw new Error("Imported data must be an array of statements.")
      }

      asObjects.forEach((item) => {
        if (!item.text || !item.truthValue) {
          throw new Error("Imported data must be an array of statements.");
        }
      });

      return asObjects;
    } 
  }
})();

export default importer;