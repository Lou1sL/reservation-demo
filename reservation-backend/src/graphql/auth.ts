
import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    employee_info: { [key: string]: any };
  }
}

export async function login(req: Request, username: string, password: string): Promise<boolean> {
  if (username === '1' && password === '1') {
    req.session.employee_info = { username };
    return true;
  }
  return false;
}

export function logout(req: Request): void {
  req.session.employee_info = undefined;
}

export function checkLoginStatus(req: Request): boolean {
  return !!req.session.employee_info;
}
