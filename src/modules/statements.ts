import crypto from "crypto";
import { Statement } from "../types";

const statements = (function module(data: Statement[]) {

  function valid(text: string) {
    text = text.toLowerCase();
    
    if (text.includes("if")) {
      console.log("Conditionals can cause application errors.");
      return false;
    } 

    if (text.includes("then")) {
      console.log("fragment detected.");
      return false;
    }

    if (text.includes("either") || text.includes("or") || text.includes("neither") || text.includes("nor")) {
      console.log("Ternary or statements should be broken into smaller statements.");
      return false;
    }

    if (text.includes("?")) {
      console.log("Questions are not considered valid statements.");
      return false;
    }

    return true; 
    
  }

  return {
    submit(statement: Statement): string {
      const isValid = valid(statement.text);
      if (isValid) {
        const alreadyExists = data.find((existingStatement) => existingStatement.text === statement.text);
        if (alreadyExists) { 
          throw new Error(`This statement conflicts with statement ${alreadyExists.id}. This would cause errors in computation.`);
        } else {
          const id = crypto.randomBytes(16).toString("hex");
          statement.id = id;
          data.push(statement);
          return id;
        }
      } else {
        throw new Error("The submitted statement was not valid.");
      }
    },
    get(options: {
      id?: string;
      text?: string;
    }): Statement|null {
      if (!options.id && !options.text) {
        throw new Error("Either ID or text is required to query the statements.");
      }

      if (options.id && options.text) {
        const match = data.find((statement) => statement.id === options.id && statement.text === options.text);
        return match || null;
      }

      if (options.id) {
        const match = data.find((statement) => statement.id === options.id);
        return match || null;
      }

      if (options.text) {
        const match = data.find((statement) => statement.text === options.text);
        return match || null;
      }

      return null;
    },
    delete(id: string) {
      const index = data.findIndex((statement) => statement.id === id);
      if (index) {
        data.splice(index, 1);
      } else {
        throw new Error("Statement was not defined.");
      }
    },
    getAll(options?: { 
      truthValue?: boolean;
    }): Statement[] {
      let statements: Statement[] = [];
      if (options && options.truthValue) {
        statements = data.filter((statement) => statement.truthValue === options.truthValue);
      } else {
        statements = data;
      }
      return statements;
    } 
  }
});

export default statements;
