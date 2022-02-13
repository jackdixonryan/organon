import exporter from "./modules/exporter";
import importer from "./modules/importer";
import statements from "./modules/statements";
import { Statement } from "./types";

interface OrganonInstance {
  export: Function;
  import?: Function;
  statements: { 
    getAll: Function;
    submit: Function;
    delete: Function;
    get: Function;
  };
}

interface OrganonInstanceOptions {
  data: string;
}

const organon = (function module() {
  return {
    start(organonInstanceOptions?: OrganonInstanceOptions): OrganonInstance {

      let statementData: Statement[];
      if (organonInstanceOptions && organonInstanceOptions.data) {
        statementData = importer.import(organonInstanceOptions.data);
      } else {
        statementData = [];
      }

      return {
        export: exporter.export,
        statements: statements(statementData),
      }
    }
  }
})();

const engine = organon.start();
engine.statements.submit({
  text: "Bob is a cow.",
  truthValue: false,
});

console.log(engine.statements.getAll());

export default organon;