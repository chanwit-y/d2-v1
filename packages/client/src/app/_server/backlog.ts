"use server";

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { usersTable, workItems } from "db";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

const db = drizzle(process.env.DATABASE_URL!);

export const test = async () => {
  const user: typeof usersTable.$inferInsert = {
    name: "John",
    age: 30,
    email: "john@example.com",
  };
  await db.insert(usersTable).values(user);
  console.log("New user created!");
  const users = await db.select().from(usersTable);
  console.log("Getting all users from the database: ", users);
};

export const getWorkItems = async () => {
  try {
    const items = await db.select().from(workItems);
    
    // Transform database items to match WorkItem interface
    const transformedItems = items.map(item => ({
      id: item.id.toString(),
      order: item.id, // Using id as order for now
      type: item.type as 'Epic' | 'Feature' | 'User Story',
      title: item.title,
      state: 'New' as const, // Default state since not in DB schema
      valueArea: 'Business', // Default value since not in DB schema
      tags: [], // Default empty array since not in DB schema
      expanded: false,
      children: [] as any[],
      description: item.description,
      parentId: item.parentId,
    }));

    // Build hierarchical structure
    const itemMap = new Map();
    const rootItems: any[] = [];

    // First, create a map of all items by ID
    transformedItems.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Then, build the hierarchy
    transformedItems.forEach(item => {
      const transformedItem = itemMap.get(item.id);
      
      if (item.parentId === 0) {
        // Root item (Epic with no parent)
        rootItems.push(transformedItem);
      } else {
        // Child item - add to parent's children array
        const parent = itemMap.get(item.parentId.toString());
        if (parent) {
          parent.children.push(transformedItem);
        } else {
          // If parent doesn't exist, treat as root item
          rootItems.push(transformedItem);
        }
      }
    });

    // Remove parentId from final output as it's not needed in the UI
    const cleanItems = (items: any[]): any[] => {
      return items.map(item => {
        const { parentId, ...cleanItem } = item;
        if (cleanItem.children.length > 0) {
          cleanItem.children = cleanItems(cleanItem.children);
        }
        return cleanItem;
      });
    };

    return cleanItems(rootItems);
  } catch (error) {
    console.error("Error fetching work items:", error);
    return [];
  }
};

export interface WorkItemFilters {
  keyword?: string;
  type?: string;
  state?: string;
  area?: string;
  tags?: string;
}

export const getFilteredWorkItems = async (filters: WorkItemFilters = {}) => {
  console.log('filters', filters);
  try {
    let query = db.select().from(workItems);
    
    // Apply filters
    const conditions: any[] = [];
    
    // Keyword filter - search in title and description
    if (filters.keyword && filters.keyword.trim() !== '') {
      const keyword = `%${filters.keyword.toLowerCase()}%`;
      conditions.push(
        `(LOWER(title) LIKE '${keyword}' OR LOWER(detail) LIKE '${keyword}')`
      );
    }
    
    // Type filter
    if (filters.type && filters.type !== 'all') {
      let typeValue = filters.type;
      if (typeValue === 'user-story') typeValue = 'User Story';
      else if (typeValue === 'feature') typeValue = 'Feature';
      else if (typeValue === 'epic') typeValue = 'Epic';
      conditions.push(`type = '${typeValue}'`);
    }

    // Note: state and area filters would require those columns in the database
    // For now, we'll just filter on the client side since they're default values
    
    const items = await db.select().from(workItems);
    
    // Apply client-side filtering for fields not in database
    let filteredItems = items;
    
    // Filter by keyword (server-side logic applied client-side for now)
    if (filters.keyword && filters.keyword.trim() !== '') {
      const keyword = filters.keyword.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(keyword) || 
        (item.description && item.description.toLowerCase().includes(keyword))
      );
    }
    
    // Filter by type
    if (filters.type && filters.type !== 'all') {
      let typeValue = filters.type;
      if (typeValue === 'user-story') typeValue = 'User Story';
      else if (typeValue === 'feature') typeValue = 'Feature';
      else if (typeValue === 'epic') typeValue = 'Epic';
      
      filteredItems = filteredItems.filter(item => item.type === typeValue);
    }
    
    // Transform filtered items
    const transformedItems = filteredItems.map(item => ({
      id: item.id.toString(),
      order: item.id,
      type: item.type as 'Epic' | 'Feature' | 'User Story',
      title: item.title,
      state: 'New' as const,
      valueArea: 'Business',
      tags: [],
      expanded: false,
      children: [] as any[],
      description: item.description,
      parentId: item.parentId,
    }));

    // Build hierarchical structure (same logic as getWorkItems)
    const itemMap = new Map();
    const rootItems: any[] = [];

    transformedItems.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    transformedItems.forEach(item => {
      const transformedItem = itemMap.get(item.id);
      
      if (item.parentId === 0) {
        rootItems.push(transformedItem);
      } else {
        const parent = itemMap.get(item.parentId.toString());
        if (parent) {
          parent.children.push(transformedItem);
        } else {
          rootItems.push(transformedItem);
        }
      }
    });

    const cleanItems = (items: any[]): any[] => {
      return items.map(item => {
        const { parentId, ...cleanItem } = item;
        if (cleanItem.children.length > 0) {
          cleanItem.children = cleanItems(cleanItem.children);
        }
        return cleanItem;
      });
    };

    return cleanItems(rootItems);
  } catch (error) {
    console.error("Error fetching filtered work items:", error);
    return [];
  }
};

export const updateWorkItem = async (
  id: number,
  updates: Partial<typeof workItems.$inferInsert>
) => {
  try {
    const embeddings = new OpenAIEmbeddings();

    // Generate new embedding if title or description changed
    if (updates.title || updates.description) {
      const embedding = await embeddings.embedQuery(
        `
        ${updates.title || ''}
        ${updates.description || ''}
        `
      );
      updates.embedding = embedding;
    }

    await db.update(workItems)
      .set(updates)
      .where(eq(workItems.id, id));
    
    console.log(`Work item ${id} updated successfully`);
  } catch (error) {
    console.error("Error updating work item:", error);
    throw error;
  }
};

export const createWorkItem = async (
  workItem: typeof workItems.$inferInsert
) => {
  const k = 5;

  const model = new ChatOpenAI({
    model: "gpt-4.1",
    temperature: 0.5,
  });

  const embeddings = new OpenAIEmbeddings();

  try {
    const embedding = await embeddings.embedQuery(
      `
      ${workItem.title}
      ${workItem.description}
      `
    );

    console.log("Embedding:", embedding.length);

    await db.insert(workItems).values({ ...workItem, embedding });
  } catch (error) {
    console.error("Error getting embedding:", error);
  }
};
