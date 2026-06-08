---
title: "N8N Workflow for Ecommerce Order to Invoice Automation 2026"
description: "Copy-paste n8n workflow that automatically generates invoices from Shopify orders and sends them via email. Saves 45 minutes per order batch."
profession: "Ecommerce"
category: "Order Processing"
contentType: workflow
tags: ["n8n workflow for ecommerce order to invoice automation", "shopify to invoice automation", "automated invoice generation", "ecommerce order processing workflow", "order fulfillment automation"]
pubDate: 2026-06-08
featured: false
---

This workflow automatically converts new Shopify orders into PDF invoices and emails them to customers within 5 minutes of order placement. It connects Shopify webhooks to a PDF generator and Gmail, eliminating the manual step of creating invoices for each order batch — typically 45 minutes of copy-paste work every morning.

## Why this automation matters

Without this automation, you manually export order data from Shopify, copy customer details into an invoice template, generate PDFs, and email each customer individually. A single missed order means a customer waits days for their invoice, potentially delaying payment. One formatting error in manual data transfer can invalidate the entire invoice batch.

## What you need before starting

- Shopify app credential with webhook permissions for your store
- Gmail OAuth2 credential connected to your business email account
- Webhook endpoint URL from your n8n instance (found in Settings > Webhooks)
- PDF invoice template with merge fields for order data
- Shopify webhook configured to trigger on "Order Created" events

## How to build it: step by step

### 1. Webhook Trigger — Receive Shopify order data

Node type: Webhook
HTTP Method: POST
Path: /shopify-order-webhook
Authentication: None
Output: Complete order object from Shopify including customer details, line items, and totals.
Why this matters: Shopify sends the full order payload immediately when an order is created, ensuring no orders are missed.

### 2. Set Variables — Extract order details

Node type: Set
Mode: Manual
Fields to set:
- customer_email: `{{ $json.email }}`
- order_number: `{{ $json.order_number }}`
- order_total: `{{ $json.total_price }}`
- customer_name: `{{ $json.billing_address.name }}`
- line_items: `{{ $json.line_items }}`
Output: Structured data object with only the fields needed for invoice generation.
Why this matters: Shopify's order object contains 200+ fields, but invoices only need 5-6 data points.

### 3. HTML Template — Generate invoice markup

Node type: HTML
Template: Invoice template with order variables
Content:
```html
<h1>Invoice #{{ $('Set Variables').item.json.order_number }}</h1>
<p>Bill To: {{ $('Set Variables').item.json.customer_name }}</p>
<table>
  {{#each $('Set Variables').item.json.line_items}}
  <tr>
    <td>{{ title }}</td>
    <td>${{ price }}</td>
  </tr>
  {{/each}}
</table>
<p>Total: ${{ $('Set Variables').item.json.order_total }}</p>
```
Output: Formatted HTML invoice ready for PDF conversion.
Why this matters: The HTML structure determines how the final PDF invoice appears to customers.

### 4. PDF Generator — Convert HTML to invoice PDF

Node type: HTML/CSS to PDF
Input Type: HTML String
HTML: `{{ $json.html }}`
Options: A4 page size, portrait orientation
File Name: `invoice-{{ $('Set Variables').item.json.order_number }}.pdf`
Output: Binary PDF file attached to the workflow item.
Why this matters: PDFs prevent customers from accidentally modifying invoice data and ensure consistent formatting across devices.

### 5. Gmail — Email invoice to customer

Node type: Gmail
Operation: Send Email
To: `{{ $('Set Variables').item.json.customer_email }}`
Subject: `Your invoice for order #{{ $('Set Variables').item.json.order_number }}`
Message: `Thank you for your order! Please find your invoice attached.`
Attachments: Binary data from PDF Generator node
Output: Email confirmation with message ID.
Why this matters: Immediate invoice delivery improves customer experience and accelerates payment processing.

## Full workflow JSON

```json
{
  "name": "Shopify Order to Invoice Automation",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "shopify-order-webhook",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Shopify Order Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "customer_email",
              "value": "={{ $json.email }}"
            },
            {
              "name": "order_number", 
              "value": "={{ $json.order_number }}"
            },
            {
              "name": "order_total",
              "value": "={{ $json.total_price }}"
            },
            {
              "name": "customer_name",
              "value": "={{ $json.billing_address.name }}"
            }
          ],
          "array": [
            {
              "name": "line_items",
              "value": "={{ $json.line_items }}"
            }
          ]
        },
        "options": {}
      },
      "id": "set-variables",
      "name": "Extract Order Details",
      "type": "n8n-nodes-base.set",
      "position": [460, 300],
      "typeVersion": 3
    },
    {
      "parameters": {
        "htmlTemplate": "<html><body><h1>Invoice #{{ $('Extract Order Details').item.json.order_number }}</h1><p><strong>Bill To:</strong> {{ $('Extract Order Details').item.json.customer_name }}</p><table border=\"1\" style=\"border-collapse: collapse; width: 100%;\"><thead><tr><th>Item</th><th>Price</th></tr></thead><tbody>{{#each $('Extract Order Details').item.json.line_items}}<tr><td>{{ title }}</td><td>${{ price }}</td></tr>{{/each}}</tbody></table><p><strong>Total: ${{ $('Extract Order Details').item.json.order_total }}</strong></p></body></html>"
      },
      "id": "html-template",
      "name": "Generate Invoice HTML",
      "type": "n8n-nodes-base.html",
      "position": [680, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "={{ $json.html }}",
        "options": {
          "format": "A4",
          "landscape": false,
          "margin": {
            "top": "0.4in",
            "bottom": "0.4in",
            "left": "0.4in", 
            "right": "0.4in"
          }
        },
        "fileName": "invoice-{{ $('Extract Order Details').item.json.order_number }}.pdf"
      },
      "id": "pdf-generator",
      "name": "Create PDF Invoice",
      "type": "n8n-nodes-base.htmlCssToPdf",
      "position": [900, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "operation": "send",
        "options": {
          "attachments": "data"
        },
        "sendTo": "={{ $('Extract Order Details').item.json.customer_email }}",
        "subject": "Your invoice for order #{{ $('Extract Order Details').item.json.order_number }}",
        "message": "Thank you for your order! Please find your invoice attached."
      },
      "id": "gmail-send",
      "name": "Email Invoice",
      "type": "n8n-nodes-base.gmail",
      "position": [1120, 300],
      "typeVersion": 1,
      "credentials": {
        "gmailOAuth2": {
          "id": "// Replace with your Gmail credential ID",
          "name": "Gmail account"
        }
      }
    }
  ],
  "connections": {
    "Shopify Order Webhook": {
      "main": [
        [
          {
            "node": "Extract Order Details",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract Order Details": {
      "main": [
        [
          {
            "node": "Generate Invoice HTML", 
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Invoice HTML": {
      "main": [
        [
          {
            "node": "Create PDF Invoice",
            "type": "main", 
            "index": 0
          }
        ]
      ]
    },
    "Create PDF Invoice": {
      "main": [
        [
          {
            "node": "Email Invoice",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "tags": [],
  "triggerCount": 0,
  "updatedAt": "2026-06-08T12:00:00.000Z",
  "versionId": "1"
}
```

## Frequently Asked Questions

### What happens if the PDF generation fails for a specific order?

The workflow stops at the PDF node and sends an error notification to the n8n error webhook if configured. The customer doesn't receive a broken email, but you'll need to manually process that order. Add an IF node after PDF generation to catch errors and send a plain text receipt instead.

### Can I modify the invoice template to include my company logo?

Yes, edit the htmlTemplate parameter in the Generate Invoice HTML node. Add an `<img>` tag with your logo URL in the HTML. The logo must be hosted online since the PDF generator can't access local files. Position it in the header section before the invoice number.

### How do I handle partial refunds or order modifications after the invoice is sent?

This workflow only triggers on new orders. For refunds, you need a separate webhook listening for Shopify's "Order Updated" event. Add a filter node to check if `$json.financial_status` equals "partially_refunded" and generate a credit note instead of a new invoice.

---

Ready to run this in production? [Start your free n8n Cloud trial](https://n8n.io/) and import the JSON above in under two minutes.