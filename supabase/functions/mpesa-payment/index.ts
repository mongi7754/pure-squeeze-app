import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface STKPushRequest {
  phone: string;
  amount: number;
  orderId: string;
  accountReference: string;
  transactionDesc: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === 'POST') {
      const body = await req.json() as STKPushRequest;
      const { phone, amount, orderId, accountReference, transactionDesc } = body;

      // Get M-Pesa credentials
      const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY');
      const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET');
      
      if (!consumerKey || !consumerSecret) {
        console.error('M-Pesa credentials not found');
        return new Response(
          JSON.stringify({ error: 'Payment service configuration error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // M-Pesa configuration (sandbox values - replace with production values)
      const shortCode = '174379'; // Test shortcode for sandbox
      const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; // Test passkey
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = btoa(shortCode + passkey + timestamp);
      const callbackUrl = `${supabaseUrl}/functions/v1/mpesa-callback`;

      // Get access token
      const auth = btoa(`${consumerKey}:${consumerSecret}`);
      const tokenResponse = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });

      if (!tokenResponse.ok) {
        console.error('Failed to get M-Pesa access token');
        return new Response(
          JSON.stringify({ error: 'Payment service authentication failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Format phone number (remove leading 0 and add 254)
      const formattedPhone = phone.startsWith('0') ? '254' + phone.slice(1) : phone;

      // STK Push request
      const stkPushPayload = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      };

      console.log('Initiating STK Push:', stkPushPayload);

      const stkResponse = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stkPushPayload),
      });

      const stkData = await stkResponse.json();
      console.log('STK Push response:', stkData);

      if (stkData.ResponseCode === '0') {
        // Update order with checkout request ID
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            mpesa_checkout_request_id: stkData.CheckoutRequestID,
            status: 'pending'
          })
          .eq('id', orderId);

        if (updateError) {
          console.error('Error updating order:', updateError);
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'STK Push sent successfully',
            checkoutRequestId: stkData.CheckoutRequestID,
            merchantRequestId: stkData.MerchantRequestID,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.error('STK Push failed:', stkData);
        return new Response(
          JSON.stringify({
            success: false,
            error: stkData.errorMessage || 'Payment request failed',
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in mpesa-payment function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});