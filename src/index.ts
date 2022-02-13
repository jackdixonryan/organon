import Argument from "./modules/argument";
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
  createArgument: Function;
}

interface OrganonInstanceOptions {
  data: string;
}

const organon = (function module() {

  function createArgument() {
    return new Argument();
  }

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
        createArgument
      }
    }
  }
})();

const engine = organon.start();
const idA = engine.statements.submit({
  text: "Bob is a cow",
  truthValue: false,
});
const idB = engine.statements.submit({
  text: "Bob wears a cowbell",
  truthValue: false,
});

// console.log(engine.statements.getAll());
const argument = engine.createArgument();
argument.premises.addConditional({
  antecedent: engine.statements.get({ id: idA }),
  consequent: engine.statements.get({ id: idB }),
});

console.log(argument.plaintext());

export default organon;