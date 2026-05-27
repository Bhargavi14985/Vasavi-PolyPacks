import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, company, message, type } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: true, message: 'Please provide at least a name and a contact number.' });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email: email || '',
        phone,
        company: company || '',
        message: message || '',
        type: type || 'CONTACT',
        status: 'NEW'
      }
    });

    res.status(201).json({
      message: 'Your inquiry has been submitted. Our team will contact you shortly.',
      lead
    });
  } catch (error: any) {
    console.error('CreateLead error:', error);
    res.status(500).json({ error: true, message: 'Failed to record lead. Please try again.' });
  }
};
