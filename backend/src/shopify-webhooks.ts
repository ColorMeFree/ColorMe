// Shopify Webhook Handler for Post-Purchase Upsell
// Captures customer information and manages the upsell flow

export interface CustomerData {
  email: string
  firstName: string
  lastName: string
  address1: string
  city: string
  province: string
  zip: string
  country: string
  totalPrice: number
  orderId: string
}

export class ShopifyWebhookHandler {
  
  // Handle order completion webhook
  async handleOrderCompleted(webhookData: any): Promise<CustomerData | null> {
    try {
      const order = webhookData.order
      
      if (!order || order.financial_status !== 'paid') {
        return null
      }
      
      // Extract customer information
      const customerData: CustomerData = {
        email: order.email,
        firstName: order.shipping_address?.first_name || order.billing_address?.first_name || '',
        lastName: order.shipping_address?.last_name || order.billing_address?.last_name || '',
        address1: order.shipping_address?.address1 || order.billing_address?.address1 || '',
        city: order.shipping_address?.city || order.billing_address?.city || '',
        province: order.shipping_address?.province || order.billing_address?.province || '',
        zip: order.shipping_address?.zip || order.billing_address?.zip || '',
        country: order.shipping_address?.country || order.billing_address?.country || '',
        totalPrice: parseFloat(order.total_price),
        orderId: order.id.toString()
      }
      
      // Store customer data for upsell (in production, use Cloudflare KV)
      await this.storeCustomerData(customerData)
      
      // Check if this is a custom book order
      const hasCustomBook = order.line_items.some((item: any) => 
        item.properties?.some((prop: any) => prop.name === 'designId')
      )
      
      if (hasCustomBook) {
        // Trigger post-purchase upsell flow
        await this.triggerUpsellFlow(customerData)
      }
      
      return customerData
      
    } catch (error) {
      console.error('Failed to handle order completed webhook:', error)
      return null
    }
  }
  
  // Store customer data for upsell
  private async storeCustomerData(customerData: CustomerData): Promise<void> {
    // In production, store in Cloudflare KV
    // await c.env.COLORBOOK_KV.put(`customer:${customerData.email}`, JSON.stringify(customerData), { expirationTtl: 86400 }) // 24 hours
    
    console.log('Customer data stored for upsell:', customerData.email)
  }
  
  // Trigger upsell flow
  private async triggerUpsellFlow(customerData: CustomerData): Promise<void> {
    try {
      // In production, this would:
      // 1. Send email with upsell offer
      // 2. Create personalized upsell page
      // 3. Track upsell opportunity
      
      console.log('Upsell flow triggered for customer:', customerData.email)
      
      // For now, just log the opportunity
      // In production, integrate with email service and tracking
      
    } catch (error) {
      console.error('Failed to trigger upsell flow:', error)
    }
  }
  
  // Get customer data for upsell
  async getCustomerData(email: string): Promise<CustomerData | null> {
    try {
      // In production, retrieve from Cloudflare KV
      // const data = await c.env.COLORBOOK_KV.get(`customer:${email}`)
      // return data ? JSON.parse(data) : null
      
      // For now, return null to indicate no data available
      // This will be properly implemented when Cloudflare KV is set up
      console.log('Customer data requested for email:', email, '- KV not yet configured')
      return null
      
    } catch (error) {
      console.error('Failed to get customer data:', error)
      return null
    }
  }
  
  // Verify webhook signature
  verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
    // In production, implement proper HMAC verification
    // For now, return true for development
    return true
  }
}

// Export singleton instance
export const shopifyWebhookHandler = new ShopifyWebhookHandler()

