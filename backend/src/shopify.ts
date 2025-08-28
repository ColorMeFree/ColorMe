// Shopify integration for webhook handling and order processing

export class ShopifyService {
  private webhookSecret: string

  constructor(webhookSecret: string) {
    this.webhookSecret = webhookSecret
  }

  // Verify Shopify webhook signature
  verifyWebhook(body: string, hmac: string): boolean {
    // TODO: Implement HMAC verification
    // const calculatedHmac = crypto
    //   .createHmac('sha256', this.webhookSecret)
    //   .update(body, 'utf8')
    //   .digest('base64')
    
    // return calculatedHmac === hmac
    
    // For MVP, return true (implement proper verification later)
    return true
  }

  // Parse order data from webhook
  parseOrder(body: string) {
    const order = JSON.parse(body)
    
    return {
      id: order.id,
      orderNumber: order.order_number,
      email: order.email,
      customer: order.customer,
      lineItems: order.line_items || [],
      shippingAddress: order.shipping_address,
      billingAddress: order.billing_address,
      totalPrice: order.total_price,
      currency: order.currency,
      createdAt: order.created_at,
    }
  }

  // Extract custom book orders from line items
  extractCustomBookOrders(lineItems: any[]) {
    return lineItems.filter(item => {
      return item.properties?.some((prop: any) => prop.name === 'designId')
    }).map(item => {
      const designId = item.properties.find((prop: any) => prop.name === 'designId')?.value
      const prompt = item.properties.find((prop: any) => prop.name === 'prompt')?.value
      
      return {
        designId,
        prompt,
        quantity: item.quantity,
        variantId: item.variant_id,
        productId: item.product_id,
      }
    })
  }

  // Send order confirmation email
  async sendOrderConfirmation(orderData: any) {
    // TODO: Implement email sending
    // For now, just log the confirmation
    console.log('Order confirmation sent:', {
      orderId: orderData.id,
      email: orderData.email,
      designCount: orderData.customBooks.length,
    })
  }

  // Update order with tracking information
  async updateOrderWithTracking(orderId: string, trackingInfo: any) {
    // TODO: Implement Shopify Admin API call to update order
    console.log('Order updated with tracking:', {
      orderId,
      trackingInfo,
    })
  }
}

// Export singleton instance
export const shopifyService = new ShopifyService(process.env.SHOPIFY_WEBHOOK_SECRET || '')
