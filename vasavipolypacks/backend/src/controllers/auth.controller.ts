import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '../db/mongodb';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'vasavi_polypacks_ultra_secret_key_for_jwt_auth_2026';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, company, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: true, message: 'Required fields: name, email, password' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: true, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        company,
        phone,
        role: 'CUSTOMER'
      }
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        phone: user.phone
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: true, message: error.message || 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Please provide email and password.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: true, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: true, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        phone: user.phone
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: true, message: error.message || 'Internal server error' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: true, message: 'Not authenticated.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        company: true,
        phone: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found.' });
    }

    res.status(200).json({ user });
  } catch (error: any) {
    console.error('getMe error:', error);
    res.status(500).json({ error: true, message: error.message || 'Internal server error' });
  }
};

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '572769494662-3a79kvilq1d6554t5pfjm3ctg1i6j9uu.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: true, message: 'Google ID token required.' });
    }

    // Verify Google ID Token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: true, message: 'Invalid Google token payload.' });
    }

    const { email, name } = payload;

    // Find or create the user in database
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Create user with CUSTOMER role
      user = await prisma.user.create({
        data: {
          email,
          password: await bcrypt.hash(Math.random().toString(36).substring(2), 10),
          name: name || email.split('@')[0],
          role: 'CUSTOMER',
          company: 'Google User',
          phone: ''
        }
      });
    }

    const sessionToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful via Google',
      token: sessionToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        phone: user.phone
      }
    });
  } catch (error: any) {
    console.error('Google login error:', error);
    res.status(500).json({ error: true, message: error.message || 'Google authentication failed.' });
  }
};
