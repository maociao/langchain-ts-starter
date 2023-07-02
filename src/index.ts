import * as dotenv from "dotenv";
import * as readline from "node:readline/promises";
import { OpenAI } from "langchain";
// import { PromptTemplate } from "langchain/prompts";
// import { LLMChain } from "langchain/chains";
import { initializeAgentExecutor } from "langchain/agents";
import { SerpAPI, Calculator } from "langchain/tools";
// import { Calculator } from "langchain/tools";

// load environment
dotenv.config();

// give the agent a brain
const model = new OpenAI({
  modelName: "gpt-3.5-turbo",
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
});

// give the agent some tools
const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "Austin,Texas,United States",
    hl: "en",
    gl: "us",
  }),
  new Calculator(),
];

// give the agent a name
const agentName = "Cody";

// create the agent
const executor = await initializeAgentExecutor(
  tools,
  model,
  "zero-shot-react-description",
  true
);
console.log("Loaded agent.");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input;
try {
  input = await rl.question("Enter your question or command: ");
} finally {
  rl.close();
}

console.log(`Executing with input "${input}"...`);

const result = await executor.call({ input });

console.log(`Got output ${result.output}`);

// const template = "Search the internet for {thing}?";
// const prompt = new PromptTemplate({
//     template,
//     inputVariables: ["thing"],
// });

// const chain = new LLMChain({ llm: model, prompt });

// const res = await chain.call({ thing: "cats" });

// console.log(res);
