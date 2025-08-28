// Lulu.com API integration for print-on-demand coloring books

export class LuluService {
  private apiKey: string
  private clientSecret: string
  private baseUrl = 'https://api.lulu.com'

  constructor(apiKey?: string, clientSecret?: string) {
    // Use passed parameters or empty strings for Cloudflare Workers
    this.apiKey = apiKey || ''
    this.clientSecret = clientSecret || ''
  }

  // Get OAuth access token
  private async getAccessToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/realms/glasstree/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.apiKey,
        client_secret: this.clientSecret,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get Lulu access token: ${response.statusText}`)
    }

    const data = await response.json()
    return data.access_token
  }

  // Create a print job for a coloring book
  async createPrintJob(designData: {
    designId: string
    prompt: string
    pages: string[] // Array of image URLs
    shippingAddress: {
      name: string
      address1: string
      address2?: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }) {
    const accessToken = await this.getAccessToken()

    // Step 1: Upload the PDF file
    const pdfUrl = await this.uploadPDF(designData.pages, accessToken)

    // Step 2: Create print job
    const printJob = await this.submitPrintJob({
      pdfUrl,
      shippingAddress: designData.shippingAddress,
      accessToken,
    })

    return printJob
  }

  // Upload PDF to Lulu
  private async uploadPDF(pages: string[], accessToken: string): Promise<string> {
    // TODO: Convert pages array to PDF
    // For now, return a placeholder URL
    const pdfUrl = 'https://example.com/coloring-book.pdf'

    const response = await fetch(`${this.baseUrl}/files/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'coloring-book.pdf',
        file_url: pdfUrl,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to upload PDF: ${response.statusText}`)
    }

    const data = await response.json() as { file_url: string }
    return data.file_url
  }

  // Submit print job to Lulu
  private async submitPrintJob(params: {
    pdfUrl: string
    shippingAddress: any
    accessToken: string
  }) {
    const response = await fetch(`${this.baseUrl}/print-jobs/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Custom Coloring Book',
        contact_email: 'orders@colormefree.com',
        line_items: [
          {
            external_id: 'coloring-book-1',
            printable_normalization: 'US_Letter_8.5x11',
            quantity: 1,
            title: 'Custom Coloring Book',
            pdf_url: params.pdfUrl,
            pod_package_id: '3020', // Standard paperback
          },
        ],
        shipping_address: params.shippingAddress,
        shipping_level: 'MAIL', // Standard shipping
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to submit print job: ${response.statusText}`)
    }

    return await response.json()
  }

  // Get print job status
  async getPrintJobStatus(jobId: string) {
    const accessToken = await this.getAccessToken()

    const response = await fetch(`${this.baseUrl}/print-jobs/${jobId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get print job status: ${response.statusText}`)
    }

    return await response.json()
  }
}

// Export singleton instance - will use environment variables
export const luluService = new LuluService()
