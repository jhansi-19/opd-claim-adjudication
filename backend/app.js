import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import errorHandler from './middlewares/errorHandler.js';
import claimRoutes from './routes/claimRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OPD Claim Adjudication API',
      version: '1.0.0',
      description: 'AI-powered OPD Insurance Claim Adjudication System API'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Claim: {
          type: 'object',
          properties: {
            claimId: { type: 'string' },
            memberName: { type: 'string' },
            memberId: { type: 'string' },
            decision: { 
              type: 'string',
              enum: ['APPROVED', 'REJECTED', 'PARTIAL', 'MANUAL_REVIEW']
            },
            approvedAmount: { type: 'number' },
            confidenceScore: { type: 'number' },
            rejectionReasons: { type: 'array', items: { type: 'string' } },
            notes: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/claims', claimRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

export default app;
