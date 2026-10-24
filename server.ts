import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Resend } from 'resend';
import twilio from 'twilio';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1.1 Config Check
  app.get('/api/config/status', (req, res) => {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const resendKey = process.env.RESEND_API_KEY;

    res.json({
      emailReady: !!resendKey && resendKey.startsWith('re_'),
      whatsappReady: !!sid && !!token && sid.startsWith('AC'),
    });
  });

  // 1.2 External Signal Webhook (For Make.com / Zapier)
  app.post('/api/signals/external', async (req, res) => {
    const { signalType, value, secret } = req.body;
    
    // Neural Link Verification
    console.log(`\n%c[NEURAL LINK] EXTERNAL SIGNAL DETECTED`, 'color: #f97316; font-weight: bold;');
    console.log(`TYPE: ${signalType}`);
    console.log(`VALUE: ${value}`);
    console.log(`TIMESTAMP: ${new Date().toLocaleTimeString()}\n`);
    
    // Return a descriptive response that looks "cool" and informative
    res.json({ 
      status: 'authenticated_signal_locked', 
      node: 'Neural-84-X',
      action: 'broadcasting_to_subscriber_pool',
      verification: 'authorized_by_Aumina_Core',
      timestamp: new Date().toISOString() 
    });
  });

  // 1.3 Generic Broadcast for Make.com
  app.post('/api/broadcast', async (req, res) => {
    const payload = req.body;
    const makeUrl = process.env.MAKE_WEBHOOK_URL || 'https://hook.us2.make.com/grycrqi613yfsgr2m4p8o6rmhy1t8dg0';

    if (!makeUrl) {
      return res.status(400).json({ error: 'Webhook URL not configured' });
    }

    try {
      fetch(makeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString(),
          source: 'Neural Core Broadcast'
        })
      }).catch(e => console.error(`Make.com Broadcast Error:`, e.message));

      res.json({ success: true, status: 'signal_broadcast_initialized' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Real Notification Endpoint
  app.post('/api/notifications/send', async (req, res) => {
    const { type, target, message, orderId, payload } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    // Use environment variable or default to the provided Make.com ID
    const makeUrl = process.env.MAKE_WEBHOOK_URL || 'https://hook.us2.make.com/grycrqi613yfsgr2m4p8o6rmhy1t8dg0';

    try {
      // 2.1 Always broadcast to Make.com if configured
      if (makeUrl && type !== 'external_only') {
        fetch(makeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'system_signal',
            type,
            orderId,
            message,
            ...payload,
            timestamp: new Date().toISOString(),
            source: 'Neural Core Backend'
          })
        }).catch(e => console.error(`Make.com Broadcast Failed:`, e.message));
      }

      if (type === 'email') {
        const resendKey = process.env.RESEND_API_KEY;
        if (!resendKey || !resendKey.startsWith('re_')) {
          console.warn('Simulation Mode: Resend key missing or invalid. Set RESEND_API_KEY to enable real emails.');
          return res.json({ success: true, provider: 'simulation', message: 'Email signal simulated (Credentials not configured)' });
        }
        
        const resend = new Resend(resendKey);
        const isToAdmin = target === adminEmail || target === 'pnishalsam@gmail.com';

        await resend.emails.send({
          from: 'Aumina System <onboarding@resend.dev>',
          to: target,
          subject: isToAdmin 
            ? `Admin Alert: New Order #${orderId?.slice(-6) || 'Signal'}`
            : `Neural Receipt: Order #${orderId?.slice(-6) || 'Signal'}`,
          html: `<div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid ${isToAdmin ? '#ff4b2b' : '#00f2ff'}">
                  <h1 style="color: ${isToAdmin ? '#ff4b2b' : '#00f2ff'};">${isToAdmin ? 'Admin Verification Required' : 'Node Synchronization Initialized'}</h1>
                  <p style="font-size: 14px; opacity: 0.8; line-height: 1.6;">${message}</p>
                  <hr style="border-color: #333; margin: 20px 0;" />
                  <p style="font-size: 10px; opacity: 0.4;">Secure Transmission via Aumina Neural Core v2.0</p>
                </div>`
        });
        return res.json({ success: true, provider: 'resend' });
      }

      if (type === 'whatsapp') {
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;
        const from = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

        if (!sid || !token || !sid.startsWith('AC')) {
          console.warn('Simulation Mode: Twilio credentials missing or invalid. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to enable real WhatsApp messages.');
          return res.json({ success: true, provider: 'simulation', message: 'WhatsApp signal simulated (Credentials not configured)' });
        }

        const client = twilio(sid, token);
        await client.messages.create({
          from,
          to: target.includes('whatsapp:') ? target : `whatsapp:${target}`,
          body: message
        });
        return res.json({ success: true, provider: 'twilio' });
      }

      res.status(400).json({ error: 'Invalid notification type' });
    } catch (error: any) {
      console.error('Core Transmission Error:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Neural Core Server active at http://localhost:${PORT}`);
  });
}

startServer();
