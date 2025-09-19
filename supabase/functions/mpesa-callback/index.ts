import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      const body = await req.json();
      console.log('M-Pesa callback received:', JSON.stringify(body, null, 2));

      const { Body } = body;
      const { stkCallback } = Body;

      const checkoutRequestId = stkCallback.CheckoutRequestID;
      const merchantRequestId = stkCallback.MerchantRequestID;
      const resultCode = stkCallback.ResultCode;
      const resultDesc = stkCallback.ResultDesc;

      console.log(`Processing callback - RequestID: ${checkoutRequestId}, ResultCode: ${resultCode}`);

      if (resultCode === 0) {
        // Payment successful
        const callbackMetadata = stkCallback.CallbackMetadata;
        const items = callbackMetadata.Item;

        // Extract payment details
        let amount = 0;
        let mpesaReceiptNumber = '';
        let transactionDate = '';
        let phoneNumber = '';

        items.forEach((item: any) => {
          switch (item.Name) {
            case 'Amount':
              amount = item.Value;
              break;
            case 'MpesaReceiptNumber':
              mpesaReceiptNumber = item.Value;
              break;
            case 'TransactionDate':
              transactionDate = item.Value;
              break;
            case 'PhoneNumber':
              phoneNumber = item.Value;
              break;
          }
        });

        console.log(`Payment successful - Amount: ${amount}, Receipt: ${mpesaReceiptNumber}`);

        // Update order status to paid
        const { data: orderData, error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            mpesa_receipt_number: mpesaReceiptNumber,
            updated_at: new Date().toISOString(),
          })
          .eq('mpesa_checkout_request_id', checkoutRequestId)
          .select();

        if (updateError) {
          console.error('Error updating order:', updateError);
        } else {
          console.log('Order updated successfully:', orderData);
        }

        // Log the successful payment
        await supabase
          .from('payment_logs')
          .insert({
            checkout_request_id: checkoutRequestId,
            merchant_request_id: merchantRequestId,
            result_code: resultCode,
            result_desc: resultDesc,
            amount: amount,
            mpesa_receipt_number: mpesaReceiptNumber,
            transaction_date: transactionDate,
            phone_number: phoneNumber,
            status: 'success',
          });

      } else {
        // Payment failed or cancelled
        console.log(`Payment failed - ResultCode: ${resultCode}, Description: ${resultDesc}`);

        // Update order status to cancelled
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('mpesa_checkout_request_id', checkoutRequestId);

        if (updateError) {
          console.error('Error updating failed order:', updateError);
        }

        // Log the failed payment
        await supabase
          .from('payment_logs')
          .insert({
            checkout_request_id: checkoutRequestId,
            merchant_request_id: merchantRequestId,
            result_code: resultCode,
            result_desc: resultDesc,
            status: 'failed',
          });
      }

      // Always return success to M-Pesa to acknowledge receipt
      return new Response(
        JSON.stringify({ ResultCode: 0, ResultDesc: 'Success' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in mpesa-callback function:', error);
    
    // Still return success to M-Pesa to avoid retries
    return new Response(
      JSON.stringify({ ResultCode: 0, ResultDesc: 'Success' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});