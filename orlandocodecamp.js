//Import the OpenAPI Large Language Model 
import { OpenAI } from "@langchain/openai"

//Load env vars 
import * as dotenv from "dotenv";
dotenv.config();

const model = new OpenAI({temperature:0.9});
const name = await model.invoke("What is a good name for a Disney-themed coffee shop?");
console.log({name});

import { PromptTemplate } from "@langchain/core/prompts";
const template = "What is a good name for a {type} shop with a {theme} theme?";
const promptTemp = new PromptTemplate({template, inputVariables:["type", "theme"]});
const formatPromptTemplate = await promptTemp.format({"type": "coffee", "theme": "Disney"});
console.log({ formatPromptTemplate});

import { LLMChain } from "langchain/chains";
const chain = new LLMChain({llm: model, prompt: promptTemp });
const res = await chain.call({"type": "coffee", "theme": "Disney"});
console.log({res});

import { AgentExecutor, createReactAgent } from "langchain/agents";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { pull } from "langchain/hub";
import { Calculator } from "langchain/tools/calculator";

const tools = [new TavilySearchResults({ maxResults: 1 }), new Calculator()]; // Define the tools the agent will have access to.
const prompt = await pull("hwchase17/react");

const llm = new OpenAI({
  modelName: "gpt-3.5-turbo-instruct",
  temperature: 0.7,
});

const agent = await createReactAgent({
    llm,
    tools,
    prompt
  });
  
  const agentExecutor = new AgentExecutor({
    agent,
    tools
  });
  
  const result = await agentExecutor.invoke({
    input: `How many Hogwarts houses are in Harry Potter? Multiply the result by today's year. Name the houses and say the answer`,//
  });

  console.log(result)