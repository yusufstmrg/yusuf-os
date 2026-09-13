import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, numeric, date, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  displayName: text('display_name').notNull(),
  slug: text('slug').notNull().unique(),
  headline: text('headline'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  summary: text('summary'),
  visibility: text('visibility').notNull().default('private'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const goals = pgTable('goals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('active'),
  progress: numeric('progress').notNull().default('0'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  notes: text('notes'),
  status: text('status').notNull().default('todo'),
  dueDate: date('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const quickCaptures = pgTable('quick_captures', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  rawInput: text('raw_input').notNull(),
  category: text('category'),
  processed: boolean('processed').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  validated: boolean('validated').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const careerTargets = pgTable('career_targets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  role: text('role').notNull(),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const deals = pgTable('deals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  stage: text('stage').notNull().default('prospecting'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const actions = pgTable('actions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  reason: text('reason'),
  status: text('status').notNull().default('recommended'),
  impactScore: numeric('impact_score'),
  createdAt: timestamp('created_at').defaultNow(),
});
