import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'vasavi_polypacks_ultra_secret_key_for_jwt_auth_2026';

export const saveConfiguration = async (req: Request, res: Response) => {
  try {
    const { bagType, color, logoUrl, logoScale, textFront, textBack, width, height, gusset, features, printingStyle } = req.body;
    
    // Decode token optionally
    let userId: string | null = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // invalid token is ignored, saving as guest
      }
    }

    if (!bagType || !color || !width || !height) {
      return res.status(400).json({ error: true, message: 'Missing parameters for 3D layout.' });
    }

    const config = await prisma.bagConfig.create({
      data: {
        userId,
        bagType,
        color,
        logoUrl: logoUrl || null,
        logoScale: Number(logoScale || 1.0),
        textFront: textFront || '',
        textBack: textBack || '',
        width: Number(width),
        height: Number(height),
        gusset: Number(gusset || 0),
        features: Array.isArray(features) ? JSON.stringify(features) : features || '[]',
        printingStyle: printingStyle || 'NONE'
      }
    });

    res.status(201).json({
      message: 'Packaging design configuration saved successfully.',
      config
    });
  } catch (error: any) {
    console.error('SaveConfig error:', error);
    res.status(500).json({ error: true, message: error.message || 'Failed to save configuration.' });
  }
};

export const getMyConfigurations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    const configs = await prisma.bagConfig.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ configs });
  } catch (error: any) {
    console.error('GetMyConfigs error:', error);
    res.status(500).json({ error: true, message: error.message || 'Failed to retrieve configurations.' });
  }
};

export const getConfigurationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const config = await prisma.bagConfig.findUnique({
      where: { id }
    });

    if (!config) {
      return res.status(404).json({ error: true, message: 'Configuration design not found.' });
    }

    res.status(200).json({ config });
  } catch (error: any) {
    console.error('GetConfigById error:', error);
    res.status(500).json({ error: true, message: 'Failed to retrieve configuration.' });
  }
};
