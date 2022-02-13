# Organon 
Sometimes we all want our processes to just be a little... wiser. Sure, they run at the speed of sound and sure, they can process scads of information in the blink of an eye, but can they work out when what they're doing is sound, or unsound? Based on the theories of formal, mathematical logic, Organon seeks to bring logic to software flows. By providing the package with "statements" and supplying a true or false value for each, the engine can help construct arguments, evaluate reasoning, and assist with more thoughtful thinking and decision-making. 

## Quickstart 
1. Install the Organon package. 
```shell
npm install --save organon
```

2. Import and initialize Organon. 
```javascript

const organon = require("organon"); 
const engine = organon.start();
```

3. Supply the package with your statement data *(optional) 

```javascript
const engine = organon.start({ 
  data: "{YOUR_JSON_STATEMENTS}"
});
```

4. Create your first statements. 
```javascript 
const engine = organon.start();

const firstId = engine.statements.submit({
  text: "Bob is a cow",
  truthValue: false,
});

const secondId = engine.statements.submit({
  text: "Bob wears a cowbell",
  truthValue: false,
});
```

5. Create your first argument. 

```javascript
const argument = engine.createArgument();

argument.premises.addComponent({
  type: "conditional",
  contents: {
    antecedent: engine.statements.get({ id: firstId }),
    consequent: engine.statements.get({ id: secondId }),
  }
});

argument.premises.addComponent({ 
  type: "statement", 
  contents: {
    statement: engine.statements.get({ id: firstId }),
  }
});

argument.conclusions.addComponent({
  type: "statement",
  contents: {
    statement: engine.statements.get({ id: secondId }),
  }
});
```

6. Invoke some dope functions for your argument. 

```javascript
console.log(argument.plaintext());
console.log(argument.getForm());
console.log(argument.getType());
console.log(argument.isValid);
console.log(argument.isSound);
```
