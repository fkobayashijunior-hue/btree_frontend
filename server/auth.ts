import bcrypt from 'bcryptjs';
import { getUserByEmail, createUser } from './db';
import { InsertUser } from '../drizzle/schema';

const SALT_ROUNDS = 10;

/**
 * Hash de senha usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verificar senha
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Registrar novo usuário
 */
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}) {
  // Verificar se email já existe
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  // Hash da senha
  const passwordHash = await hashPassword(data.password);

  // Criar usuário
  const user: InsertUser = {
    name: data.name,
    email: data.email,
    passwordHash,
    loginMethod: 'email',
    role: data.role || 'user',
  };

  await createUser(user);

  // Retornar usuário sem senha
  const newUser = await getUserByEmail(data.email);
  if (!newUser) {
    throw new Error('Erro ao criar usuário');
  }

  const { passwordHash: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

/**
 * Login de usuário
 */
export async function loginUser(email: string, password: string) {
  // Buscar usuário
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Email ou senha inválidos');
  }

  // Verificar se tem senha
  if (!user.passwordHash) {
    throw new Error('Usuário não possui senha cadastrada');
  }

  // Verificar senha
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Email ou senha inválidos');
  }

  // Retornar usuário sem senha
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
