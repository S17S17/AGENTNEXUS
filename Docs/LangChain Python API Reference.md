LangChain Python API Reference
langchain: 0.2.15
agents
Agent is a class that uses an LLM to choose a sequence of actions to take.

In Chains, a sequence of actions is hardcoded. In Agents, a language model is used as a reasoning engine to determine which actions to take and in which order.

Agents select and use Tools and Toolkits for actions.

Class hierarchy:

BaseSingleActionAgent --> LLMSingleActionAgent
                          OpenAIFunctionsAgent
                          XMLAgent
                          Agent --> <name>Agent  # Examples: ZeroShotAgent, ChatAgent


BaseMultiActionAgent  --> OpenAIMultiFunctionsAgent
Main helpers:

AgentType, AgentExecutor, AgentOutputParser, AgentExecutorIterator,
AgentAction, AgentFinish
Classes

agents.agent.AgentExecutor

Agent that is using tools.

agents.agent.AgentOutputParser

Base class for parsing agent output into agent action/finish.

agents.agent.BaseMultiActionAgent

Base Multi Action Agent class.

agents.agent.BaseSingleActionAgent

Base Single Action Agent class.

agents.agent.ExceptionTool

Tool that just returns the query.

agents.agent.MultiActionAgentOutputParser

Base class for parsing agent output into agent actions/finish.

agents.agent.RunnableAgent

Agent powered by Runnables.

agents.agent.RunnableMultiActionAgent

Agent powered by Runnables.

agents.agent_iterator.AgentExecutorIterator(...)

Iterator for AgentExecutor.

agents.agent_toolkits.vectorstore.toolkit.VectorStoreInfo

Information about a VectorStore.

agents.agent_toolkits.vectorstore.toolkit.VectorStoreRouterToolkit

Toolkit for routing between Vector Stores.

agents.agent_toolkits.vectorstore.toolkit.VectorStoreToolkit

Toolkit for interacting with a Vector Store.

agents.chat.output_parser.ChatOutputParser

Output parser for the chat agent.

agents.conversational.output_parser.ConvoOutputParser

Output parser for the conversational agent.

agents.conversational_chat.output_parser.ConvoOutputParser

Output parser for the conversational agent.

agents.mrkl.base.ChainConfig(action_name, ...)

Configuration for a chain to use in MRKL system.

agents.mrkl.output_parser.MRKLOutputParser

MRKL Output parser for the chat agent.

agents.openai_assistant.base.OpenAIAssistantAction

AgentAction with info needed to submit custom tool output to existing run.

agents.openai_assistant.base.OpenAIAssistantFinish

AgentFinish with run and thread metadata.

agents.openai_assistant.base.OpenAIAssistantRunnable

Run an OpenAI Assistant.

agents.openai_functions_agent.agent_token_buffer_memory.AgentTokenBufferMemory

Memory used to save agent output AND intermediate steps.

agents.output_parsers.json.JSONAgentOutputParser

Parses tool invocations and final answers in JSON format.

agents.output_parsers.openai_functions.OpenAIFunctionsAgentOutputParser

Parses a message into agent action/finish.

agents.output_parsers.openai_tools.OpenAIToolsAgentOutputParser

Parses a message into agent actions/finish.

agents.output_parsers.react_json_single_input.ReActJsonSingleInputOutputParser

Parses ReAct-style LLM calls that have a single tool input in json format.

agents.output_parsers.react_single_input.ReActSingleInputOutputParser

Parses ReAct-style LLM calls that have a single tool input.

agents.output_parsers.self_ask.SelfAskOutputParser

Parses self-ask style LLM calls.

agents.output_parsers.tools.ToolAgentAction

Fields:
agents.output_parsers.tools.ToolsAgentOutputParser

Parses a message into agent actions/finish.

agents.output_parsers.xml.XMLAgentOutputParser

Parses tool invocations and final answers in XML format.

agents.react.output_parser.ReActOutputParser

Output parser for the ReAct agent.

agents.schema.AgentScratchPadChatPromptTemplate

Chat prompt template for the agent scratchpad.

agents.structured_chat.output_parser.StructuredChatOutputParser

Output parser for the structured chat agent.

agents.structured_chat.output_parser.StructuredChatOutputParserWithRetries

Output parser with retries for the structured chat agent.

agents.tools.InvalidTool

Tool that is run when invalid tool name is encountered by agent.

Functions

agents.agent_toolkits.conversational_retrieval.openai_functions.create_conversational_retrieval_agent(...)

A convenience method for creating a conversational retrieval agent.

agents.format_scratchpad.log.format_log_to_str(...)

Construct the scratchpad that lets the agent continue its thought process.

agents.format_scratchpad.log_to_messages.format_log_to_messages(...)

Construct the scratchpad that lets the agent continue its thought process.

agents.format_scratchpad.openai_functions.format_to_openai_function_messages(...)

Convert (AgentAction, tool output) tuples into FunctionMessages.

agents.format_scratchpad.openai_functions.format_to_openai_functions(...)

Convert (AgentAction, tool output) tuples into FunctionMessages.

agents.format_scratchpad.tools.format_to_tool_messages(...)

Convert (AgentAction, tool output) tuples into ToolMessages.

agents.format_scratchpad.xml.format_xml(...)

Format the intermediate steps as XML.

agents.json_chat.base.create_json_chat_agent(...)

Create an agent that uses JSON to format its logic, build for Chat Models.

agents.openai_functions_agent.base.create_openai_functions_agent(...)

Create an agent that uses OpenAI function calling.

agents.openai_tools.base.create_openai_tools_agent(...)

Create an agent that uses OpenAI tools.

agents.output_parsers.openai_tools.parse_ai_message_to_openai_tool_action(message)

Parse an AI message potentially containing tool_calls.

agents.output_parsers.tools.parse_ai_message_to_tool_action(message)

Parse an AI message potentially containing tool_calls.

agents.react.agent.create_react_agent(llm, ...)

Create an agent that uses ReAct prompting.

agents.self_ask_with_search.base.create_self_ask_with_search_agent(...)

Create an agent that uses self-ask with search prompting.

agents.structured_chat.base.create_structured_chat_agent(...)

Create an agent aimed at supporting tools with multiple inputs.

agents.tool_calling_agent.base.create_tool_calling_agent(...)

Create an agent that uses tools.

agents.utils.validate_tools_single_input(...)

Validate tools for single input.

agents.xml.base.create_xml_agent(llm, tools, ...)

Create an agent that uses XML to format its logic.

Deprecated classes

agents.agent.Agent

Deprecated since version 0.1.0: Use new agent constructor methods like create_react_agent, create_json_agent, create_structured_chat_agent, etc.

agents.agent.LLMSingleActionAgent

Deprecated since version 0.1.0: Use new agent constructor methods like create_react_agent, create_json_agent, create_structured_chat_agent, etc.

agents.agent_types.AgentType(value)

Deprecated since version 0.1.0: Use new agent constructor methods like create_react_agent, create_json_agent, create_structured_chat_agent, etc.

agents.chat.base.ChatAgent

Deprecated since version 0.1.0: Use create_react_agent instead.

agents.conversational.base.ConversationalAgent

Deprecated since version 0.1.0: Use create_react_agent instead.

agents.conversational_chat.base.ConversationalChatAgent

Deprecated since version 0.1.0: Use create_json_chat_agent instead.

agents.mrkl.base.MRKLChain

Deprecated since version 0.1.0.

agents.mrkl.base.ZeroShotAgent

Deprecated since version 0.1.0: Use create_react_agent instead.

agents.openai_functions_agent.base.OpenAIFunctionsAgent

Deprecated since version 0.1.0: Use create_openai_functions_agent instead.

agents.openai_functions_multi_agent.base.OpenAIMultiFunctionsAgent

Deprecated since version 0.1.0: Use create_openai_tools_agent instead.

agents.react.base.DocstoreExplorer(docstore)

Deprecated since version 0.1.0.

agents.react.base.ReActChain

Deprecated since version 0.1.0.

agents.react.base.ReActDocstoreAgent

Deprecated since version 0.1.0.

agents.react.base.ReActTextWorldAgent

Deprecated since version 0.1.0.

agents.self_ask_with_search.base.SelfAskWithSearchAgent

Deprecated since version 0.1.0: Use create_self_ask_with_search instead.

agents.self_ask_with_search.base.SelfAskWithSearchChain

Deprecated since version 0.1.0.

agents.structured_chat.base.StructuredChatAgent

Deprecated since version 0.1.0: Use create_structured_chat_agent instead.

agents.xml.base.XMLAgent

Deprecated since version 0.1.0: Use create_xml_agent instead.

Deprecated functions

agents.agent_toolkits.vectorstore.base.create_vectorstore_agent(...)

Deprecated since version 0.2.13: See API reference for this function for a replacement implementation: https://api.python.langchain.com/en/latest/agents/langchain.agents.agent_toolkits.vectorstore.base.create_vectorstore_agent.html Read more here on how to create agents that query vector stores: https://python.langchain.com/v0.2/docs/how_to/qa_chat_history_how_to/#agents

agents.agent_toolkits.vectorstore.base.create_vectorstore_router_agent(...)

Deprecated since version 0.2.13: See API reference for this function for a replacement implementation: https://api.python.langchain.com/en/latest/agents/langchain.agents.agent_toolkits.vectorstore.base.create_vectorstore_router_agent.html Read more here on how to create agents that query vector stores: https://python.langchain.com/v0.2/docs/how_to/qa_chat_history_how_to/#agents

agents.initialize.initialize_agent(tools, llm)

Deprecated since version 0.1.0: Use Use new agent constructor methods like create_react_agent, create_json_agent, create_structured_chat_agent, etc. instead.

agents.loading.load_agent(path, **kwargs)

Deprecated since version 0.1.0.

agents.loading.load_agent_from_config(