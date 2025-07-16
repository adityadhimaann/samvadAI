import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET() {
  try {
    const healthData = {
      status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        gemini: !!config.gemini.apiKey && config.gemini.apiKey !== 'your_gemini_api_key_here',
        database: !!config.database.url,
        voice: true, // Web Speech API is browser-based
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: config.app.environment,
    };

    // Check if any critical service is down
    const criticalServices = [healthData.services.gemini];
    const isHealthy = criticalServices.every(service => service === true);

    if (!isHealthy) {
      return NextResponse.json(
        {
          ...healthData,
          status: 'degraded' as const,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(healthData, {
      status: isHealthy ? 200 : 503,
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    );
  }
}
