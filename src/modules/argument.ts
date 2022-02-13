import { Statement } from "../types";

interface Conditional {
  consequent: Statement;
  antecedent: Statement;
}

interface Disjunction {
  disjunctA: Statement;
  disjunctB: Statement;
}

class Argument { 

  premises: {
    addConditional: Function;
    addDisjunction: Function;
    addStatement: Function;
    list: (Conditional | Disjunction | Statement)[];
  }

  conclusions: {
    addConditional: Function;
    addDisjunction: Function;
    addStatement: Function;
    list: (Conditional | Disjunction | Statement)[];
  }


  constructor() {
    this.premises = {
      addConditional: this.addConditional,
      addDisjunction: this.addDisjunction,
      addStatement: this.addStatement,
      list: []
    };

    this.conclusions = {
      addConditional: this.addConditional,
      addDisjunction: this.addDisjunction,
      addStatement: this.addStatement,
      list: []
    };
  }

  addConditional(conditional: Conditional): void {
    // console.log(this); // understand that THIS will bind to either conclusions or premises.
    // TS, however, is not aware that "this" is bound differently.
    // @ts-ignore 
    this.list.push(conditional);
  }

  addDisjunction(disjunction: Disjunction): void {
    // @ts-ignore 
    this.list.push(disjunction);
  }

  addStatement(statement: Statement): void {
    // @ts-ignore
    this.list.push(statement);
  }

  // returns the argument in plaintext.
  plaintext() {
    let prints = ``;
    this.premises.list.forEach((entry) => { 
      const conditional = entry as Conditional;
      const statement = entry as Statement;
      const disjunction = entry as Disjunction;

      // this is just stupid
      if (conditional.antecedent) {
        prints += `if ${conditional.antecedent.text}, `;
      } 
      
      if (conditional.consequent) {
        prints += `then ${conditional.consequent.text}. `;
      }

      if (statement.text) {
        prints += `${statement.text}. `;
      }

      if (disjunction.disjunctA) {
        prints += `Either ${disjunction.disjunctA.text}, `
      }

      if (disjunction.disjunctB) {
        prints += `or ${disjunction.disjunctB.text}. `
      }
    });

    this.conclusions.list.forEach((entry) => {
      // prints += ent
    });

    return prints;
  }

}

export default Argument;