import Argument from "./modules/argument";
import exporter from "./modules/exporter";
import importer from "./modules/importer";
import statements from "./modules/statements";
import { Statement } from "./types";

interface OrganonInstance {
  export: () => string;
  import?: (data: string) => void;
  statements: { 
    getAll: (options?: { truthValue: boolean}) => Statement[];
    submit: (statement: Statement) => string;
    delete: (id: string) => void;
    get: (options: { id?: string; text?: string }) => Statement | null;
  };
  createArgument: () => Argument;
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

const argument = engine.createArgument();
argument.premises.addComponent({
  type: "conditional",
  contents: {
    antecedent: engine.statements.get({ id: idA }),
    consequent: engine.statements.get({ id: idB }),
  }
});

argument.premises.addComponent({ 
  type: "statement", 
  contents: {
    statement: engine.statements.get({ id: idA }),
  }
});

argument.conclusions.addComponent({
  type: "statement",
  contents: {
    statement: engine.statements.get({ id: idB }),
  }
})

console.log(argument.plaintext());
console.log(argument.getForm());
console.log(argument.isSound());

export default organon;