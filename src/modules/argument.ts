import { Statement } from "../types";

interface Conditional {
  consequent: Statement;
  antecedent: Statement;
}

interface Disjunction {
  disjunctA: Statement;
  disjunctB: Statement;
}

interface Component {
  type: "conditional"|"disjunction"|"statement";
  contents: {
    consequent?: Statement;
    antecedent?: Statement;
    disjunctA?: Statement;
    disjunctB?: Statement;
    statement?: Statement;
  }
}

class Argument { 

  premises: {
    addComponent: Function;
    list: Component[];
  }

  conclusions: {
    addComponent: Function;
    list: Component[];
  }


  constructor() {
    this.premises = {
      addComponent: this.addComponent,
      list: []
    };

    this.conclusions = {
      addComponent: this.addComponent,
      list: []
    };
  }

  addComponent(component: Component): void {
    // console.log(this); // understand that THIS will bind to either conclusions or premises.
    // TS, however, is not aware that "this" is bound differently.
    // @ts-ignore 
    this.list.push(component);
  }

  // returns the argument in plaintext.
  plaintext() {
    let value = ``;
    this.premises.list.forEach((entry: Component) => { 
      value += this.evaluateEntryAsPlaintext(entry);
    });

    value += "Therefore, ";

    this.conclusions.list.forEach((entry) => {
      value += this.evaluateEntryAsPlaintext(entry);
    });

    return value;
  }

  evaluateEntryAsPlaintext(entry: Component): string {
    let stringValue = ``;
    if (entry.type === "conditional") {
      stringValue += `if ${entry.contents.antecedent?.text}, `;
      stringValue += `then ${entry.contents.consequent?.text}. `;
    } else if (entry.type === "statement") {
      stringValue += `${entry.contents.statement?.text}. `;
    } else if (entry.type === "disjunction") { 
      stringValue += `Either ${entry.contents.disjunctA?.text}, `
      stringValue += `or ${entry.contents.disjunctB?.text}. `
    }
    return stringValue;
  }

  getForm(): string {
    let currentVarIndex = 0;
    const possibleVarValues = ["A", "B", "C", "D", "E", "F", "G"];
    let idsToVars: any = {};
    let value = ``;
    this.premises.list.forEach((entry: Component) => { 
      const results = this.evaluateEntryAsFormText(entry, currentVarIndex, possibleVarValues, idsToVars);
      idsToVars = results.idsToVars; 
      currentVarIndex = results.currentVarIndex;
      value += results.value;
    });

    value += "Therefore, ";

    this.conclusions.list.forEach((entry) => {
      const results = this.evaluateEntryAsFormText(entry, currentVarIndex, possibleVarValues, idsToVars);
      idsToVars = results.idsToVars; 
      currentVarIndex = results.currentVarIndex;
      value += results.value;
    });

    return value;
  }

  evaluateEntryAsFormText(entry: Component, currentVarIndex: number, possibleVarValues: string[], idsToVars: any): any {
    let stringValue = ``;
    if (entry.type === "conditional") {
      const antecedentId = entry.contents.antecedent?.id as string;
      const antecedentResults = this.determineVariableValue(antecedentId, idsToVars, possibleVarValues, currentVarIndex);
      const antecedentVarValue = antecedentResults.value;
      idsToVars = antecedentResults.newMap;
      currentVarIndex = antecedentResults.newVarIndex;

      const consequentId = entry.contents.consequent?.id as string;
      const consequentResults = this.determineVariableValue(consequentId, idsToVars, possibleVarValues, currentVarIndex);
      const consequentVarValue = consequentResults.value;
      idsToVars = consequentResults.newMap;
      currentVarIndex = consequentResults.newVarIndex;

      stringValue += `if ${antecedentVarValue}, `;
      stringValue += `then ${consequentVarValue}. `;

    } else if (entry.type === "statement") {
      const statementId = entry.contents.statement?.id as string;
      const statementResults = this.determineVariableValue(statementId, idsToVars, possibleVarValues, currentVarIndex);
      const statementVarValue = statementResults.value;
      idsToVars = statementResults.newMap;
      currentVarIndex = statementResults.newVarIndex;
      
      stringValue += `${statementVarValue}. `;
    } else if (entry.type === "disjunction") { 
      const disjunctAId = entry.contents.disjunctA?.id as string;
      const disjunctAResults = this.determineVariableValue(disjunctAId, idsToVars, possibleVarValues, currentVarIndex);
      const disjunctAVarValue = disjunctAResults.value;

      const disjunctBId = entry.contents.disjunctA?.id as string;
      const disjunctBResults = this.determineVariableValue(disjunctBId, idsToVars, possibleVarValues, currentVarIndex);
      const disjunctBVarValue = disjunctBResults.value;

      stringValue += `Either ${disjunctAVarValue}, `
      stringValue += `or ${disjunctBVarValue}. `
    }

    return {
      value: stringValue, 
      idsToVars, 
      currentVarIndex
    };
  }

  determineVariableValue(id: string, map: any, possibleVarValues: string[], currentVarIndex: number): { newMap: any, value: string, newVarIndex: number } {
    let variableValue: string;
    if (!map[id]) { 
      map[id] = possibleVarValues[currentVarIndex];
      variableValue = possibleVarValues[currentVarIndex];
    } else {
      variableValue = map[id];
    }

    return {
      newMap: map, 
      value: variableValue, 
      newVarIndex: currentVarIndex + 1
    };  
  }

  getType(): string {
    const form: string = this.getForm();
    if (form.trim() == "if A, then B. A. Therefore, B.") {
      return "modus ponens";
    } else {
      return "none"
    }
  }
}

export default Argument;