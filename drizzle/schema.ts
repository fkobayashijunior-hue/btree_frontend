import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) - NULLABLE para suportar login com email/senha */
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** Hash da senha (bcrypt) - para autenticação própria */
  passwordHash: varchar("password_hash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }).default("email").notNull(),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Perfis de usuário
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  profileType: mysqlEnum("profile_type", [
    "administrativo",
    "encarregado",
    "mecanico",
    "motosserrista",
    "carregador",
    "operador",
    "motorista",
    "terceirizado"
  ]).notNull(),
  cpf: varchar("cpf", { length: 14 }),
  phone: varchar("phone", { length: 20 }),
  pixKey: varchar("pix_key", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Tipos de equipamentos
export const equipmentTypes = mysqlTable("equipment_types", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Equipamentos
export const equipment = mysqlTable("equipment", {
  id: int("id").autoincrement().primaryKey(),
  typeId: int("type_id").notNull().references(() => equipmentTypes.id),
  name: varchar("name", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 100 }),
  model: varchar("model", { length: 100 }),
  year: int("year"),
  serialNumber: varchar("serial_number", { length: 100 }),
  imageUrl: text("image_url"),
  status: mysqlEnum("status", ["ativo", "manutencao", "inativo"]).default("ativo").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Saídas de cargas
export const cargoShipments = mysqlTable("cargo_shipments", {
  id: int("id").autoincrement().primaryKey(),
  truckId: int("truck_id").notNull().references(() => equipment.id),
  driverId: int("driver_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  height: varchar("height", { length: 20 }).notNull(),
  width: varchar("width", { length: 20 }).notNull(),
  length: varchar("length", { length: 20 }).notNull(),
  volume: varchar("volume", { length: 20 }).notNull(),
  destination: varchar("destination", { length: 255 }),
  invoiceNumber: varchar("invoice_number", { length: 100 }),
  woodType: varchar("wood_type", { length: 100 }),
  client: varchar("client", { length: 255 }),
  imagesUrls: text("images_urls"),
  registeredBy: int("registered_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Abastecimentos
export const fuelRecords = mysqlTable("fuel_records", {
  id: int("id").autoincrement().primaryKey(),
  equipmentId: int("equipment_id").notNull().references(() => equipment.id),
  operatorId: int("operator_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  fuelType: mysqlEnum("fuel_type", ["diesel", "gasolina", "mistura_2t"]).notNull(),
  liters: varchar("liters", { length: 20 }).notNull(),
  totalValue: varchar("total_value", { length: 20 }).notNull(),
  pricePerLiter: varchar("price_per_liter", { length: 20 }),
  odometer: varchar("odometer", { length: 20 }),
  station: varchar("station", { length: 255 }),
  invoiceUrl: text("invoice_url"),
  odometerImageUrl: text("odometer_image_url"),
  registeredBy: int("registered_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Registro de presença
export const attendanceRecords = mysqlTable("attendance_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  employmentType: mysqlEnum("employment_type", ["clt", "terceirizado", "diarista"]).notNull(),
  dailyValue: varchar("daily_value", { length: 20 }).notNull(),
  pixKey: varchar("pix_key", { length: 255 }).notNull(),
  function: varchar("function", { length: 100 }).notNull(),
  observations: text("observations"),
  paymentStatus: mysqlEnum("payment_status", ["pendente", "pago", "atrasado", "cancelado"]).default("pendente").notNull(),
  paidAt: timestamp("paid_at"),
  paidBy: int("paid_by").references(() => users.id),
  registeredBy: int("registered_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;
export type EquipmentType = typeof equipmentTypes.$inferSelect;
export type InsertEquipmentType = typeof equipmentTypes.$inferInsert;
export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = typeof equipment.$inferInsert;
export type CargoShipment = typeof cargoShipments.$inferSelect;
export type InsertCargoShipment = typeof cargoShipments.$inferInsert;
export type FuelRecord = typeof fuelRecords.$inferSelect;
export type InsertFuelRecord = typeof fuelRecords.$inferInsert;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type InsertAttendanceRecord = typeof attendanceRecords.$inferInsert;