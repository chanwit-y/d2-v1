"use server";

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { workItems } from "db";
import { drizzle } from "drizzle-orm/node-postgres";
import { cosineDistance, sql } from "drizzle-orm/sql";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const db = drizzle(process.env.DATABASE_URL!);

export const chat = async (message: string) => {
  const model = new ChatOpenAI({
    model: "gpt-4.1",
    temperature: 0.5,
  });
  const embeddings = new OpenAIEmbeddings();
  try {
    const embedding = await embeddings.embedQuery(message);

    console.log("Retrieving documents...");
    const retrievedDocs = await db
      .select({
        id: workItems.id,
        title: workItems.title,
        description: workItems.description,
        similarity: sql<number>`1 - (${cosineDistance(
          workItems.embedding,
          embedding
        )})`.as("similarity"),
      })
      .from(workItems)
      .orderBy(sql`embedding <=> ${JSON.stringify(embedding)}`) // Order by cosine distance
      .limit(5);
    console.log("Retrieved documents:", retrievedDocs);

    const retrievedContent = retrievedDocs.map((doc) => doc.description);
    console.log("Retrieved content:", retrievedContent);

    const template = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Answer the user question based on the following context: {context}.",
      ],
      [
        "system",
        `As a Business Analyst, I specialize in web application requirements—gathering and analyzing user needs, defining specifications, and aligning solutions with business goals.`,
      ],
//       [
//         "system",
//         `As a QA tester, I have solid expertise in testing web applications and websites, ensuring their functionality, usability, and performance.`,
//       ],
      [
        "system",
        `You are a careful assistant helping answer user questions. Use only the information in the retrieved context below. If an answer is not explicitly stated, reply: "The provided information does not contain enough detail to answer that." Do not make up any rules, steps, or details that are not in the given context.`,
      ],
      new MessagesPlaceholder("chat_history"),
      //     ['system', "You are an expert SQL generator. Use the table definitions below to write a SQL query that answers the question."],
      ["user", "{input}"],
    ]);

    console.log("Template:", template);

    const chain = template.pipe(model);

    const res = await chain.invoke({
      input: message,
      context: retrievedContent,
      chat_history: [], // Provide empty chat history for now
    });

    return res.content as string;
  } catch (error) {
    console.error("Error getting embedding:", error);
  }
};
