export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Retorna a URL de login do sistema próprio (email/senha)
export const getLoginUrl = (returnPath?: string) => {
  const base = `${window.location.origin}/login`;
  if (returnPath) {
    return `${base}?redirect=${encodeURIComponent(returnPath)}`;
  }
  return base;
};
